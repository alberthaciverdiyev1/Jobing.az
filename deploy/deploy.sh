#!/usr/bin/env bash
#
# deploy.sh — GitHub'a push sonrası sunucuda çalışan derleme + yayına alma.
# CI (.github/workflows/deploy.yml) bu script'i SSH ile çağırır; elle de çalıştırılabilir.
#
# ÖNEMLİ: Uygulama HER ZAMAN AYAKTA kalır — `artisan down` KULLANILMAZ.
#
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/jobing}"
PHP_VER="${PHP_VER:-8.3}"
BRANCH="${BRANCH:-main}"
APP_USER="${APP_USER:-deploy}"
PHP_BIN="${PHP_BIN:-/usr/bin/php}"

log() { echo -e "\n\033[1;36m▶ $*\033[0m"; }

cd "$APP_DIR"

# ── Deploy-dan ƏVVƏL: bütün verilənlər bazalarını yedəklə + Telegram-a göndər ──
if [ -x "deploy/backup-databases.sh" ]; then
  log "Verilənlər bazası yedəyi (deploy öncəsi)"
  bash deploy/backup-databases.sh || echo "⚠ Yedək alınmadı, deploy davam edir"
fi

log "Kod çekiliyor ($BRANCH)"
sudo -u "$APP_USER" git fetch --all --prune
sudo -u "$APP_USER" git reset --hard "origin/$BRANCH"

log "Composer (production)"
sudo -u "$APP_USER" composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

log "Frontend derleme (Vite)"
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" npm run build

log "Veritabanı migrasyonları"
sudo -u "$APP_USER" "$PHP_BIN" artisan migrate --force

log "Storage link"
sudo -u "$APP_USER" "$PHP_BIN" artisan storage:link || true

log "Cache'ler"
sudo -u "$APP_USER" "$PHP_BIN" artisan optimize:clear
sudo -u "$APP_USER" "$PHP_BIN" artisan optimize

log "İzinler"
chown -R "$APP_USER":www-data "$APP_DIR"
chmod -R ug+rwX "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"

log "PHP-FPM reload (kesintisiz)"
sudo systemctl reload "php${PHP_VER}-fpm"

log "Queue worker grace restart"
sudo -u "$APP_USER" "$PHP_BIN" artisan queue:restart || true

log "Sağlık kontrolü"
URL="${HEALTH_URL:-http://127.0.0.1}"
CODE=$(curl -s -o /dev/null -w '%{http_code}' "$URL/up" || echo 000)
if [[ "$CODE" != "200" ]]; then
  echo "UYARI: /up sağlık kontrolü başarısız (kod: $CODE)"; exit 1
fi

log "Deploy tamam ($(date '+%Y-%m-%d %H:%M:%S'))"
