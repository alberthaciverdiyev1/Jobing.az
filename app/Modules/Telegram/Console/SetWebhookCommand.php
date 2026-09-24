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

            return self::SUCCESS;
        }

        $this->error('Webhook kaydedilemedi. Token/URL kontrol edin.');

        return self::FAILURE;
    }
}
