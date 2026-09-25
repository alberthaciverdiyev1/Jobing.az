#!/usr/bin/env bash
# Server geneli PostgreSQL yedəyi: bütün verilənlər bazalarını dump edib Telegram-a göndərir.
# Qeyd: .env-dəki DB_USERNAME yalnız tək tətbiq üçün yetkilidir; bütün DB-lər üçün süper
# istifadəçi (peer auth ilə postgres) istifadə olunur.
set -euo pipefail

ENV_FILE="${ENV_FILE:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.env}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/jobing}"
KEEP_DAYS="${KEEP_DAYS:-14}"
# Bütün DB-ləri dump etmək üçün süper istifadəçi (peer auth). DB_USERNAME istifadə olunmur.
BACKUP_DB_USER="${BACKUP_DB_USER:-postgres}"
PG_SOCKET="${PG_SOCKET:-/var/run/postgresql}"
# Telegram bot dokument limiti (50 MB).
TG_MAX_BYTES=$((50 * 1024 * 1024))

log() { echo -e "\033[1;36m▶ $*\033[0m"; }
warn() { echo -e "\033[1;33m⚠ $*\033[0m"; }
envval() { grep -E "^$1=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- | sed 's/^"//;s/"$//'; }

TG_TOKEN="$(envval DATABASE_BACKUP_TELEGRAM_BOT_TOKEN)"
TG_CHAT="$(envval DATABASE_BACKUP_TELEGRAM_BOT_CHAT_ID)"

# pg_dump/psql-i süper istifadəçi kimi işlədəcək ön əki təyin et.
SU=""
if [ "$(id -u)" = "0" ] && [ "$BACKUP_DB_USER" = "postgres" ]; then
  if command -v runuser >/dev/null 2>&1; then SU="runuser -u postgres --"; else SU="sudo -u postgres"; fi
fi

mkdir -p "$BACKUP_DIR"
STAMP="$(date '+%Y-%m-%d_%H-%M-%S')"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

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

COUNT=0; FAILED=""
for db in $DBS; do
  case "$db" in postgres|template0|template1) continue ;; esac
  if DUMP "$db" > "$WORK/${db}.dump" 2>"$WORK/${db}.err"; then
    log "  • $db ($(du -h "$WORK/${db}.dump" | cut -f1))"
    COUNT=$((COUNT + 1))
  else
    warn "  ✗ $db yedəklənə bilmədi: $(head -c 140 "$WORK/${db}.err")"
    FAILED="$FAILED $db"
    rm -f "$WORK/${db}.dump"
  fi
done

ARCHIVE="$BACKUP_DIR/jobing-backup-${STAMP}.tar.gz"
tar -czf "$ARCHIVE" -C "$WORK" . 2>/dev/null || true
SIZE_BYTES="$(stat -c%s "$ARCHIVE" 2>/dev/null || echo 0)"
SIZE="$(du -h "$ARCHIVE" | cut -f1)"
log "Yedək hazırdır: $ARCHIVE ($SIZE, $COUNT baza)"
find "$BACKUP_DIR" -name 'jobing-backup-*.tar.gz' -mtime +"$KEEP_DAYS" -delete 2>/dev/null || true

if [ -z "$TG_TOKEN" ]; then
  warn "Telegram bot token yoxdur. Yedək yalnız serverdə saxlanıldı."
  exit 0
fi
if [ -z "$TG_CHAT" ]; then
  warn "chat_id təyin olunmayıb. .env → DATABASE_BACKUP_TELEGRAM_BOT_CHAT_ID dəyərini yaz."
  exit 0
fi

CAPTION="🗄 Server DB yedəyi
📅 $STAMP
🗃 $COUNT baza
📦 $SIZE"
[ -n "$FAILED" ] && CAPTION="$CAPTION
⚠️ Alınmayan:$FAILED"

if [ "$SIZE_BYTES" -gt "$TG_MAX_BYTES" ]; then
  warn "Arxiv 50 MB-dan böyükdür ($SIZE); Telegram-a göndərilmədi, serverdə saxlanıldı: $ARCHIVE"
  curl -s -o /dev/null --max-time 20 -X POST "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TG_CHAT}" \
    --data-urlencode "text=${CAPTION}
❗️ Fayl 50 MB limitindən böyükdür; serverdə saxlanıldı: ${ARCHIVE}" || true
  exit 0
fi

HTTP=$(curl -s -o /dev/null -w '%{http_code}' --max-time 180 \
  -F "chat_id=${TG_CHAT}" -F "document=@${ARCHIVE}" -F "caption=${CAPTION}" \
  "https://api.telegram.org/bot${TG_TOKEN}/sendDocument" || echo 000)

[ "$HTTP" = "200" ] && log "Telegram-a göndərildi ✅" || warn "Telegram göndərişi alınmadı (HTTP $HTTP). Yedək: $ARCHIVE"
