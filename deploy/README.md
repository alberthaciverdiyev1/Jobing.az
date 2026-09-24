# Deploy

İki script:

## 1) `install-server.sh` — sıfırdan sunucu kurulumu (Ubuntu 22.04/24.04)

```bash
sudo DOMAIN=kariyer.kibriskare.com \
     APP_DIR=/var/www/kariyer.kibriskare \
     DB_PASS='guclu-bir-sifre' \
     REPO_URL=git@github.com:alberthacirverdiyev1/kariyer.kibriskare.com.git \
     LE_EMAIL=admin@kariyer.kibriskare.com \
     bash deploy/install-server.sh
```

Kurduğu ve ayarladığı şeyler:
- Nginx, PHP-FPM + eklentiler, PostgreSQL, Redis, Node.js, Composer
- Sistem kullanıcısı + proje dizini + `.env` (production, Redis cache/session/queue)
- `composer install`, `npm ci && npm run build`, `migrate`, `storage:link`, `optimize`
- Nginx site + SSL (certbot, opsiyonel)
- **PHP-FPM `pm = dynamic`** → sürekli ayakta, **ondemand değil**
- **systemd `kariyer.kibriskare-queue`** servisi → queue worker her zaman çalışır
- **cron** → her dakika `schedule:run` (premium süresi dolanlar vb.)
- UFW (22/80/443)

## 2) `deploy.sh` — push sonrası derle + yayına al

Sunucuda çalışır; `.github/workflows/deploy.yml` bunu SSH ile tetikler:

```bash
cd /var/www/kariyer.kibriskare && bash deploy/deploy.sh
```

Yaptığı: `git reset --hard origin/main` → `composer install --no-dev` → `npm ci && npm run build` → `migrate --force` → `storage:link` → `optimize` → izinler → `systemctl reload php-fpm` → `queue:restart` → `/up` sağlık kontrolü.

**Uygulama hiç düşmez** (`artisan down` yok); yeni sürüm derlenip biter, php-fpm kesintisiz reload olur.

## GitHub Secrets (repo → Settings → Secrets → Actions)

| Secret | Örnek |
|---|---|
| `SSH_HOST` | `123.123.123.123` |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | deploy kullanıcısının özel anahtarı (deploy key) |
| `SSH_PORT` | `22` |
| `APP_DIR` | `/var/www/kariyer.kibriskare` |
| `HEALTH_URL` | `https://kariyer.kibriskare.com` |

## Notlar
- Sunucuda `deploy` kullanıcısına `sudo systemctl reload php8.3-fpm` için yetki ver (veya `deploy.sh`'ı root/systemd ile çalıştır).
- `main` dışında deploy etmek istersen workflow'daki `branches` ve `deploy.sh` içindeki `BRANCH`'i güncelle.
- Lokal geliştirmede cache/session `file`; production'da `install-server.sh` bunları **Redis**'e çevirir.


`deploy.sh` her deploy'dan **önce** bunu otomatik çalıştırır:
- Sunucudaki **tüm PostgreSQL veritabanlarını** (ana + `kariyer.kibriskare_logs`) `pg_dump` ile yedekler
- `tar.gz` yapıp `/var/backups/kariyer.kibriskare/` altında tutar (14 gün saklanır)
- Telegram bot aracılığıyla yedeği sana gönderir

Gerekli `.env` değişkenleri:
```
DATABASE_BACKUP_TELEGRAM_BOT_TOKEN=...   # @BotFather'dan
DATABASE_BACKUP_TELEGRAM_BOT_CHAT_ID=... # senin chat id'in
```
> Güvenlik için chat_id **otomatik algılanmaz** — yalnızca belirttiğin chat'e gönderilir.
> Chat id'ini bulmak için bota `/start` yaz, sonra: `curl "https://api.telegram.org/bot<TOKEN>/getUpdates"`


Yeni ilan eklendiğinde (onay bekleyen):
1. Adminlere panel bildirimi gider
2. Telegram'a **✅ Onayla / ❌ Reddet** düğmeleriyle mesaj gider
3. Reddedersen bot senden **red sebebini** sorar ve onu kaydeder

Webhook kaydı (deploy'dan sonra bir kez):
```bash
php artisan telegram:set-webhook
```


`activity_logs` ve `app_logs` ana veritabanında değil — **`kariyer.kibriskare_logs`** veritabanındadır (`logs` bağlantısı).
`.env`:
```
LOG_DB_DATABASE=kariyer.kibriskare_logs
LOG_DB_HOST / PORT / USERNAME / PASSWORD
```

## Zamanlanmış tapşırıqlar (cron)
```
promotions:expire  → saatlıq
news:import        → saatlık (RSS haberleri)
```
