#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-new.jobing.az}"
SITE_NAME="${SITE_NAME:-${DOMAIN//./-}}"
APP_DIR="${APP_DIR:-/var/www/jobing}"
APP_USER="${APP_USER:-deploy}"
DB_NAME="${DB_NAME:-jobing}"
DB_USER="${DB_USER:-jobing}"
DB_PASS="${DB_PASS:-$(openssl rand -hex 16)}"
LOG_DB_NAME="${LOG_DB_NAME:-jobing_logs}"
REPO_URL="${REPO_URL:-git@github.com:CHANGE_ME/jobing.git}"
BRANCH="${BRANCH:-main}"
PHP_VER="${PHP_VER:-8.3}"
NODE_MAJOR="${NODE_MAJOR:-20}"
WITH_SSL="${WITH_SSL:-yes}"
LE_EMAIL="${LE_EMAIL:-admin@jobing.az}"

log() { echo -e "\n\033[1;36m▶ $*\033[0m"; }
die() { echo -e "\033[1;31m✖ $*\033[0m" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Root olarak çalıştır: sudo bash $0"
export DEBIAN_FRONTEND=noninteractive

log "Paketler kuruluyor"
apt-get update -y
apt-get install -y software-properties-common curl ca-certificates gnupg lsb-release unzip git ufw

add-apt-repository -y ppa:ondrej/php
apt-get update -y
apt-get install -y \
  php${PHP_VER}-fpm php${PHP_VER}-cli php${PHP_VER}-pgsql php${PHP_VER}-mbstring \
  php${PHP_VER}-xml php${PHP_VER}-curl php${PHP_VER}-zip php${PHP_VER}-gd \
  php${PHP_VER}-bcmath php${PHP_VER}-intl php${PHP_VER}-redis

apt-get install -y postgresql postgresql-contrib

apt-get install -y redis-server

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi

if ! command -v composer >/dev/null 2>&1; then
  curl -fsSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi

apt-get install -y nginx

log "Sistem kullanıcısı ve dizin"
id -u "$APP_USER" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "$APP_USER"
usermod -aG www-data "$APP_USER"
mkdir -p "$APP_DIR"
chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

log "PostgreSQL veritabanı"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
  || sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${LOG_DB_NAME}'" | grep -q 1 \
  || sudo -u postgres createdb -O "${DB_USER}" "${LOG_DB_NAME}"

log "Repo klonlanıyor"
if [[ ! -d "$APP_DIR/.git" ]]; then
  sudo -u "$APP_USER" git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

if [[ ! -f .env ]]; then
  cp .env.example .env
  sed -i "s#^APP_ENV=.*#APP_ENV=production#" .env
  sed -i "s#^APP_DEBUG=.*#APP_DEBUG=false#" .env
  sed -i "s#^APP_URL=.*#APP_URL=https://${DOMAIN}#" .env
  sed -i "s#^DB_CONNECTION=.*#DB_CONNECTION=pgsql#" .env
  sed -i "s#^DB_HOST=.*#DB_HOST=127.0.0.1#" .env
  sed -i "s#^DB_PORT=.*#DB_PORT=5432#" .env
  sed -i "s#^DB_DATABASE=.*#DB_DATABASE=${DB_NAME}#" .env
  sed -i "s#^DB_USERNAME=.*#DB_USERNAME=${DB_USER}#" .env
  sed -i "s#^DB_PASSWORD=.*#DB_PASSWORD=${DB_PASS}#" .env
  sed -i "s#^CACHE_STORE=.*#CACHE_STORE=redis#" .env
  sed -i "s#^SESSION_DRIVER=.*#SESSION_DRIVER=redis#" .env
  sed -i "s#^QUEUE_CONNECTION=.*#QUEUE_CONNECTION=redis#" .env
  sed -i "s#^REDIS_CLIENT=.*#REDIS_CLIENT=phpredis#" .env
  cat >> .env <<LOGDENV

LOG_DB_HOST=${DB_HOST}
LOG_DB_PORT=5432
LOG_DB_DATABASE=${LOG_DB_NAME}
LOG_DB_USERNAME=${DB_USER}
LOG_DB_PASSWORD=${DB_PASS}

DATABASE_BACKUP_TELEGRAM_BOT_TOKEN=
DATABASE_BACKUP_TELEGRAM_BOT_CHAT_ID=
LOGDENV
fi
sudo -u "$APP_USER" php artisan key:generate --force

sudo -u "$APP_USER" composer install --no-dev --optimize-autoloader --no-interaction
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" npm run build
sudo -u "$APP_USER" php artisan migrate --force
sudo -u "$APP_USER" php artisan storage:link || true
sudo -u "$APP_USER" php artisan optimize

chown -R "$APP_USER":www-data "$APP_DIR"
chmod -R ug+rwX "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"
chmod -R o-rwx "$APP_DIR/.env"

log "Nginx yapılandırması"
cat >/etc/nginx/sites-available/${SITE_NAME} <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${APP_DIR}/public;

    index index.php;
    charset utf-8;
    client_max_body_size 20M;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php\$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php${PHP_VER}-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff2?)\$ {
        expires 30d;
        access_log off;
    }

    location ~ /\.(?!well-known).* { deny all; }
}
NGINX
ln -sf /etc/nginx/sites-available/${SITE_NAME} /etc/nginx/sites-enabled/${SITE_NAME}
nginx -t
systemctl reload nginx

log "PHP-FPM havuzu (pm=dynamic)"
POOL=/etc/php/${PHP_VER}/fpm/pool.d/www.conf
sed -i "s#^pm = .*#pm = dynamic#" "$POOL"
sed -i "s#^pm.max_children = .*#pm.max_children = 20#" "$POOL"
sed -i "s#^pm.start_servers = .*#pm.start_servers = 4#" "$POOL"
sed -i "s#^pm.min_spare_servers = .*#pm.min_spare_servers = 2#" "$POOL"
sed -i "s#^pm.max_spare_servers = .*#pm.max_spare_servers = 6#" "$POOL"
sed -i "/^pm.process_idle_timeout/d" "$POOL"
systemctl enable php${PHP_VER}-fpm
systemctl restart php${PHP_VER}-fpm

log "Queue worker servisi"
cat >/etc/systemd/system/${SITE_NAME}-queue.service <<UNIT
[Unit]
Description=Jobing queue worker
After=network.target postgresql.service redis-server.service

[Service]
User=${APP_USER}
Group=www-data
Restart=always
RestartSec=5
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/php ${APP_DIR}/artisan queue:work --sleep=3 --tries=3 --timeout=120 --max-time=3600
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now ${SITE_NAME}-queue

log "Scheduler cron"
CRON="* * * * * cd ${APP_DIR} && /usr/bin/php artisan schedule:run >> /dev/null 2>&1"
( crontab -u "$APP_USER" -l 2>/dev/null | grep -vF "artisan schedule:run" ; echo "$CRON" ) | crontab -u "$APP_USER" -

sed -i "s#^bind .*#bind 127.0.0.1 -::1#" /etc/redis/redis.conf || true
sed -i "s#^supervised .*#supervised systemd#" /etc/redis/redis.conf || true
systemctl enable --now redis-server

log "Firewall (22/80/443)"
ufw allow OpenSSH || true
ufw allow 'Nginx Full' || true
ufw --force enable || true

if [[ "$WITH_SSL" == "yes" ]]; then
  log "Let's Encrypt SSL"
  apt-get install -y certbot python3-certbot-nginx
  certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "${LE_EMAIL}" --redirect || \
    echo "⚠ SSL alınamadı (DNS hazır olmayabilir). Sonra: certbot --nginx -d ${DOMAIN}"
fi

log "Kurulum tamam! 🎉"
cat <<INFO

  APP_DIR   : ${APP_DIR}
  DB        : ${DB_NAME} / ${DB_USER}
  DB_PASS   : ${DB_PASS}   ← .env içinde, kaydet!
  URL       : https://${DOMAIN}

  Servisler : php${PHP_VER}-fpm, nginx, jobing-queue, redis-server, cron(scheduler)
  Hepsi boot'ta otomatik başlar; PHP-FPM "ondemand" DEĞİL, sürekli ayakta.
INFO
