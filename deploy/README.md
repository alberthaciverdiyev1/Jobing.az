# Deploy

İki script:

## 1) `install-server.sh` — sıfırdan sunucu kurulumu (Ubuntu 22.04/24.04)

```bash
sudo DOMAIN=jobing.az \
     APP_DIR=/var/www/jobing \
     DB_PASS='guclu-bir-sifre' \
     REPO_URL=git@github.com:alberthacirverdiyev1/Jobing.az.git \
     LE_EMAIL=admin@jobing.az \
     bash deploy/install-server.sh
```

Kurduğu ve ayarladığı şeyler:
- Nginx, PHP-FPM + eklentiler, PostgreSQL, Redis, Node.js, Composer
- Sistem kullanıcısı + proje dizini + `.env` (production, Redis cache/session/queue)
- `composer install`, `npm ci && npm run build`, `migrate`, `storage:link`, `optimize`
- Nginx site + SSL (certbot, opsiyonel)
- **PHP-FPM `pm = dynamic`** → sürekli ayakta, **ondemand değil**
- **systemd `jobing-queue`** servisi → queue worker her zaman çalışır
- **cron** → her dakika `schedule:run` (premium süresi dolanlar vb.)
- UFW (22/80/443)

## 2) `deploy.sh` — push sonrası derle + yayına al

Sunucuda çalışır; `.github/workflows/deploy.yml` bunu SSH ile tetikler:

```bash
cd /var/www/jobing && bash deploy/deploy.sh
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
| `APP_DIR` | `/var/www/jobing` |
| `HEALTH_URL` | `https://jobing.az` |

## Notlar
- Sunucuda `deploy` kullanıcısına `sudo systemctl reload php8.3-fpm` için yetki ver (veya `deploy.sh`'ı root/systemd ile çalıştır).
- `main` dışında deploy etmek istersen workflow'daki `branches` ve `deploy.sh` içindeki `BRANCH`'i güncelle.
- Lokal geliştirmede cache/session `file`; production'da `install-server.sh` bunları **Redis**'e çevirir.

## 3) `backup-databases.sh` — deploy öncesi yedək + Telegram

İki rejim:
- **Arqumentsiz** → serverdəki **bütün** bazalar (həftəlik cron üçün).
- **Arqumentli** → yalnız göstərilən bazalar. `deploy.sh` hər deploy'dan **önce** yalnız
  **o layihənin** bazalarını yedəkləyir (`.env` → `DB_DATABASE` + `LOG_DB_DATABASE`).

Hər baza ayrı-ayrı `pg_dump` edilib Telegram-a `sendDocument` ilə göndərilir; fayllar
`/var/backups/jobing/<tarix>/`-də saxlanılır (28 gün). Süper istifadəçi (peer auth postgres)
işlədilir. Həftəlik: `0 4 * * 1 /var/www/new-jobing/deploy/backup-databases.sh`

Gərəkli `.env` dəyişənləri:
```
DATABASE_BACKUP_TELEGRAM_BOT_TOKEN=...   # @BotFather-dən
DATABASE_BACKUP_TELEGRAM_BOT_CHAT_ID=... # sənin chat id-in
```
> Təhlükəsizlik üçün chat_id **avtomatik aşkarlanmır** — yalnız göstərdiyin chat-a göndərilir.
> Chat id-ni tapmaq üçün bot-a `/start` yaz, sonra: `curl "https://api.telegram.org/bot<TOKEN>/getUpdates"`

## 4) Telegram ilə vakansiya təsdiqi

Yeni vakansiya əlavə edildikdə (təsdiq gözləyən):
1. Adminlərə panel bildirişi gedir
2. Telegram-a **✅ Təsdiqlə / ❌ Rədd et** düymələri ilə mesaj gedir
3. Rədd edərsənsə, bot səndən **rədd səbəbini** soruşur və onu saxlayır

Webhook qeydiyyatı (deploy-dan sonra bir dəfə):
```bash
php artisan telegram:set-webhook
```

## 5) Loglar üçün ayrı verilənlər bazası

`activity_logs` və `app_logs` əsas bazada deyil — **`jobing_logs`** bazasındadır (`logs` bağlantısı).
`.env`:
```
LOG_DB_DATABASE=jobing_logs
LOG_DB_HOST / PORT / USERNAME / PASSWORD
```

## Zamanlanmış tapşırıqlar (cron)
```
promotions:expire  → saatlıq
news:import        → saatlıq (RSS xəbərləri)
```
