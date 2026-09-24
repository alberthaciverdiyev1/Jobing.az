#!/usr/bin/env bash
#
#
set -euo pipefail

ENV_FILE="${ENV_FILE:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.env}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/kariyer.kibriskare}"
KEEP_DAYS="${KEEP_DAYS:-14}"

log() { echo -e "\033[1;36m▶ $*\033[0m"; }
warn() { echo -e "\033[1;33m⚠ $*\033[0m"; }
envval() { grep -E "^$1=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- | sed 's/^"//;s/"$//'; }

DB_HOST="$(envval DB_HOST)"; DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="$(envval DB_PORT)"; DB_PORT="${DB_PORT:-5432}"
DB_USER="$(envval DB_USERNAME)"; DB_USER="${DB_USER:-postgres}"
DB_PASS="$(envval DB_PASSWORD)"
TG_TOKEN="$(envval DATABASE_BACKUP_TELEGRAM_BOT_TOKEN)"
TG_CHAT="$(envval DATABASE_BACKUP_TELEGRAM_BOT_CHAT_ID)"

export PGHOST="$DB_HOST" PGPORT="$DB_PORT" PGUSER="$DB_USER" PGPASSWORD="$DB_PASS"

mkdir -p "$BACKUP_DIR"
STAMP="$(date '+%Y-%m-%d_%H-%M-%S')"
WORK="$(mktemp -d)"

log "Verilənlər bazaları yedəklənir ($DB_HOST:$DB_PORT)"
DBS="$(psql -tAc "SELECT datname FROM pg_database WHERE datistemplate=false AND datallowconn=true" 2>/dev/null || true)"
[ -z "$DBS" ] && warn "Baza tapılmadı və ya PostgreSQL əlçatmazdır."

COUNT=0
for db in $DBS; do
  case "$db" in postgres|template0|template1) continue ;; esac
  log "  • $db"
  pg_dump -Fc "$db" > "$WORK/${db}.dump" 2>/dev/null || pg_dump "$db" | gzip > "$WORK/${db}.sql.gz"
  COUNT=$((COUNT+1))
done

ARCHIVE="$BACKUP_DIR/kariyer.kibriskare-backup-${STAMP}.tar.gz"
tar -czf "$ARCHIVE" -C "$WORK" . 2>/dev/null || true
rm -rf "$WORK"
SIZE="$(du -h "$ARCHIVE" | cut -f1)"
log "Yedək hazırdır: $ARCHIVE ($SIZE, $COUNT baza)"
find "$BACKUP_DIR" -name 'kariyer.kibriskare-backup-*.tar.gz' -mtime +"$KEEP_DAYS" -delete 2>/dev/null || true

if [ -z "$TG_TOKEN" ]; then
  warn "Telegram bot token yoxdur. Yedək yalnız serverdə saxlanıldı."
  exit 0
fi

if [ -z "$TG_CHAT" ]; then
  warn "chat_id təyin olunmayıb. .env → DATABASE_BACKUP_TELEGRAM_BOT_CHAT_ID dəyərini yaz."
  warn "(Təhlükəsizlik: avtomatik aşkarlama qəsdən söndürülüb — yedək yalnız sənin chat_id-nə gedir.)"
  exit 0
fi

CAPTION="🗄 Kariyer.KibrisKare deploy öncəsi yedək
📅 $STAMP
🗃 $COUNT baza
📦 $SIZE"

HTTP=$(curl -s -o /dev/null -w '%{http_code}' \
  -F "chat_id=${TG_CHAT}" -F "document=@${ARCHIVE}" -F "caption=${CAPTION}" \
  "https://api.telegram.org/bot${TG_TOKEN}/sendDocument" || echo 000)

[ "$HTTP" = "200" ] && log "Telegram-a göndərildi ✅" || warn "Telegram göndərişi alınmadı (HTTP $HTTP). Yedək: $ARCHIVE"
