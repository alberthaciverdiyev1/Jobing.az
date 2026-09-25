<?php

namespace App\Modules\Telegram\Console;

use App\Modules\Core\Services\TelegramService;
use Illuminate\Console\Command;

class SetWebhookCommand extends Command
{
    protected $signature = 'telegram:set-webhook {url?}';

    protected $description = 'Telegram webhook-unu qeyd edir (default: APP_URL/api/telegram/webhook).';

    public function handle(TelegramService $telegram): int
    {
        $url = $this->argument('url') ?: rtrim(config('app.url'), '/') . '/api/telegram/webhook';

        if ($telegram->setWebhook($url)) {
            $this->info("Webhook qeyd edildi: {$url}");

            if ($telegram->setMyCommands([
                ['command' => 'views', 'description' => 'Saytın günlük ziyarətçi statistikası'],
            ])) {
                $this->info('/views komandası bot menyusuna əlavə edildi.');
            }

            return self::SUCCESS;
        }

        $this->error('Webhook qeyd edilə bilmədi. Token/URL-i yoxlayın.');

        return self::FAILURE;
    }
}
