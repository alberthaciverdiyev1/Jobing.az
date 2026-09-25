#!/usr/bin/env bash
set -euo pipefail

umask 002

APP_DIR="${APP_DIR:-/var/www/jobing}"
PHP_VER="${PHP_VER:-8.3}"
BRANCH="${BRANCH:-main}"
APP_USER="${APP_USER:-deploy}"
WEB_USER="${WEB_USER:-www-data}"
PHP_BIN="${PHP_BIN:-/usr/bin/php}"

log() { echo -e "\n\033[1;36m▶ $*\033[0m"; }

fix_write_perms() {
  chown -R "$WEB_USER":www-data "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" 2>/dev/null || true
  find "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" -type d -exec chmod 2775 {} + 2>/dev/null || true
  find "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" -type f -exec chmod 664 {} + 2>/dev/null || true
}

cd "$APP_DIR"

# Deploy öncəsi yalnız BU layihənin bazalarını yedəklə (bütün server bazaları deyil).
envval() { grep -E "^$1=" .env 2>/dev/null | tail -1 | cut -d= -f2- | tr -d '"' ; }
PROJECT_DBS=()
for _k in DB_DATABASE LOG_DB_DATABASE; do
  _v="$(envval "$_k" || true)"
  [ -n "$_v" ] && PROJECT_DBS+=("$_v")
done
if [ -x "deploy/backup-databases.sh" ]; then
  log "Layihə DB yedəyi (deploy öncəsi): ${PROJECT_DBS[*]:-—}"
  bash deploy/backup-databases.sh "${PROJECT_DBS[@]}" || echo "⚠ Yedək alınmadı, deploy davam edir"
fi

log "Kod çekiliyor ($BRANCH)"
sudo -u "$APP_USER" git fetch --all --prune
sudo -u "$APP_USER" git reset --hard "origin/$BRANCH"

fix_write_perms

log "Composer (production)"
sudo -u "$APP_USER" composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

log "Frontend derleme (Vite)"
export PATH="/opt/node20/bin:$PATH"
NODE_MAJOR="$(node -v 2>/dev/null | sed 's/^v\([0-9]*\).*$/\1/')"
if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 18 ]; then
  sudo -u "$APP_USER" env PATH="/opt/node20/bin:$PATH" npm ci
  sudo -u "$APP_USER" env PATH="/opt/node20/bin:$PATH" npm run build
else
  echo "⚠ Node < 18 — commit edilmiş public/build istifadə olunur"
fi

log "storage/bootstrap/cache izinleri"
fix_write_perms

log "Veritabanı migrasyonları"
sudo -u "$WEB_USER" "$PHP_BIN" artisan migrate --force

log "Storage link"
sudo -u "$WEB_USER" "$PHP_BIN" artisan storage:link || true

log "Cache'ler"
sudo -u "$WEB_USER" "$PHP_BIN" artisan optimize:clear
sudo -u "$WEB_USER" "$PHP_BIN" artisan optimize

log "Queue worker grace restart"
sudo -u "$WEB_USER" "$PHP_BIN" artisan queue:restart || true

log "İzinler"
chown -R "$APP_USER":www-data "$APP_DIR"
fix_write_perms

log "PHP-FPM reload (kesintisiz)"
sudo systemctl reload "php${PHP_VER}-fpm"

log "Sağlık kontrolü"
URL="${HEALTH_URL:-https://127.0.0.1}"
CODE=$(curl -sk -o /dev/null -w '%{http_code}' "$URL/up" || echo 000)
if [[ "$CODE" != "200" ]]; then
  echo "UYARI: /up sağlık kontrolü başarısız (kod: $CODE)"; exit 1
fi

log "Deploy tamam ($(date '+%Y-%m-%d %H:%M:%S'))"
