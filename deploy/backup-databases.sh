#!/usr/bin/env bash
# Server geneli PostgreSQL yedəyi: HƏR verilənlər bazasını ayrı-ayrı Telegram-a göndərir.
# Bütün DB-lər üçün süper istifadəçi (peer auth ilə postgres) istifadə olunur; .env-dəki
# DB_USERNAME yalnız tək tətbiq üçün yetkili olduğundan istifadə edilmir.
# Həftəlik cron nümunəsi: 0 4 * * 1 /var/www/new-jobing/deploy/backup-databases.sh
set -euo pipefail

ENV_FILE="${ENV_FILE:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.env}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/jobing}"
KEEP_DAYS="${KEEP_DAYS:-28}"
BACKUP_DB_USER="${BACKUP_DB_USER:-postgres}"
PG_SOCKET="${PG_SOCKET:-/var/run/postgresql}"
# Telegram bot dokument limiti (50 MB) — tək baza bunu keçərsə göndərilmir.
TG_MAX_BYTES=$((50 * 1024 * 1024))

log()  { echo -e "\033[1;36m▶ $*\033[0m"; }
warn() { echo -e "\033[1;33m⚠ $*\033[0m"; }
envval() { grep -E "^$1=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- | sed 's/^"//;s/"$//'; }

TG_TOKEN="$(envval DATABASE_BACKUP_TELEGRAM_BOT_TOKEN)"
TG_CHAT="$(envval DATABASE_BACKUP_TELEGRAM_BOT_CHAT_ID)"

# pg_dump/psql-i süper istifadəçi kimi işlədəcək ön əki təyin et.
SU=""
if [ "$(id -u)" = "0" ] && [ "$BACKUP_DB_USER" = "postgres" ]; then
  if command -v runuser >/dev/null 2>&1; then SU="runuser -u postgres --"; else SU="sudo -u postgres"; fi
fi

STAMP="$(date '+%Y-%m-%d_%H-%M-%S')"
RUN_DIR="$BACKUP_DIR/$STAMP"
mkdir -p "$RUN_DIR"

if [ -n "$SU" ]; then
  log "Bazalar yedəklənir (süper istifadəçi=$BACKUP_DB_USER, socket=$PG_SOCKET)"
  DBS="$($SU psql -h "$PG_SOCKET" -tAc "SELECT datname FROM pg_database WHERE datistemplate=false AND datallowconn=true" 2>/dev/null || true)"
  DUMP() { $SU pg_dump -h "$PG_SOCKET" -Fc "$1"; }
else
  DB_HOST="$(envval DB_HOST)"; DB_HOST="${DB_HOST:-127.0.0.1}"
  DB_PORT="$(envval DB_PORT)"; DB_PORT="${DB_PORT:-5432}"
  DB_USER="$(envval BACKUP_DB_USER)"; DB_USER="${DB_USER:-$BACKUP_DB_USER}"
  export PGPASSWORD="$(envval DB_PASSWORD)"
  log "Bazalar yedəklənir ($DB_HOST:$DB_PORT, istifadəçi=$DB_USER)"
  DBS="$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tAc "SELECT datname FROM pg_database WHERE datistemplate=false AND datallowconn=true" 2>/dev/null || true)"
  DUMP() { pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -Fc "$1"; }
fi

[ -z "$DBS" ] && warn "Baza tapılmadı və ya PostgreSQL əlçatmazdır."

send_msg() { # $1 = text
  [ -n "$TG_TOKEN" ] && [ -n "$TG_CHAT" ] || return 0
  curl -s -o /dev/null --max-time 20 -X POST \
    "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TG_CHAT}" --data-urlencode "text=$1" || true
}

COUNT=0; FAILED=""
for db in $DBS; do
  case "$db" in postgres|template0|template1) continue ;; esac
  FILE="$RUN_DIR/${db}-${STAMP}.dump"
  if DUMP "$db" > "$FILE" 2>"$RUN_DIR/${db}.err"; then
    SZ="$(stat -c%s "$FILE" 2>/dev/null || echo 0)"
    HUM="$(du -h "$FILE" | cut -f1)"
    COUNT=$((COUNT + 1))
    log "  • $db ($HUM)"
    if [ -n "$TG_TOKEN" ] && [ -n "$TG_CHAT" ]; then
      if [ "$SZ" -gt "$TG_MAX_BYTES" ]; then
        warn "    $db 50 MB-dan böyükdür; göndərilmədi (serverdə: $FILE)"
        send_msg "🗄 ${db} yedəyi 50 MB limitindən böyükdür ($HUM). Serverdə saxlanıldı."
      else
        HTTP=$(curl -s -o /dev/null -w '%{http_code}' --max-time 300 \
          -F "chat_id=${TG_CHAT}" -F "document=@${FILE}" -F "parse_mode=HTML" \
          -F "caption=🗄 <b>${db}</b> yedəyi
📅 ${STAMP}
📦 ${HUM}" \
          "https://api.telegram.org/bot${TG_TOKEN}/sendDocument" || echo 000)
        if [ "$HTTP" = "200" ]; then log "    → Telegram ✅"; else warn "    → göndərilmədi (HTTP $HTTP)"; FAILED="$FAILED $db"; fi
      fi
    fi
  else
    warn "  ✗ $db yedəklənə bilmədi: $(head -c 140 "$RUN_DIR/${db}.err")"
    FAILED="$FAILED $db"
    rm -f "$FILE"
  fi
done
rm -f "$RUN_DIR"/*.err 2>/dev/null || true

SUFFIX=""; [ -n "$FAILED" ] && SUFFIX=" | alınmayan:$FAILED"
log "Yedək hazırdır: $RUN_DIR ($COUNT baza)$SUFFIX"
send_msg "🗄 <b>Həftəlik DB yedəyi</b>
📅 ${STAMP}
✅ ${COUNT} baza göndərildi${FAILED:+
⚠️ alınmayan:$FAILED}"

find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"$KEEP_DAYS" -exec rm -rf {} + 2>/dev/null || true
