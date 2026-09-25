<?php

namespace App\Modules\Core\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected function token(): ?string
    {
        return config('services.telegram.token');
    }

    protected function chatId(): ?string
    {
        return config('services.telegram.chat_id');
    }

    protected function apiUrl(): string
    {
        return 'https://api.telegram.org/bot' . $this->token();
    }

    public function send(string $message): bool
    {
        if (! $this->token() || ! $this->chatId()) {
            Log::warning('Telegram bildirişi göndərilmədi: token və ya chat_id təyin edilməyib.');
            return false;
        }

        try {
            $response = Http::timeout(5)->post($this->apiUrl() . '/sendMessage', [
                'chat_id' => $this->chatId(),
                'text' => $message,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true,
            ]);

            if (! $response->json('ok', false)) {
                Log::warning('Telegram göndəriş xətası: ' . $response->body());
            }

            return (bool) $response->json('ok', false);
        } catch (\Throwable $e) {
            Log::warning('Telegram xətası: ' . $e->getMessage());
            return false;
        }
    }

    public function sendNewApplication(\App\Modules\Application\Models\Application $application): void
    {
        $vacancy = $application->vacancy;

        $message = "📄 <b>YENİ İŞ MÜRACİƏTİ</b>\n"
            . "👤 <b>Namizəd:</b> " . e($application->applicant_name) . "\n"
            . "📮 <b>E-poçt:</b> " . e($application->applicant_email ?? '-') . "\n"
            . "📞 <b>Telefon:</b> " . e($application->applicant_phone ?? '-') . "\n"
            . "💼 <b>Vakansiya:</b> " . e($vacancy?->title ?? '-') . "\n"
            . "🏢 <b>Şirkət:</b> " . e($vacancy?->company?->name ?? '-') . "\n"
            . "🆔 <b>ID:</b> #{$application->id}";

        $this->send($message);
    }

    public function sendNewLead(\App\Modules\Inquiry\Models\Inquiry $inquiry): void
    {
        $message = "✉️ <b>YENİ ƏLAQƏ MÜRACİƏTİ</b>\n"
            . "👤 <b>Ad:</b> " . e($inquiry->name) . "\n"
            . "📮 <b>E-poçt:</b> " . e($inquiry->email ?? '-') . "\n"
            . "📞 <b>Telefon:</b> " . e($inquiry->phone ?? '-') . "\n"
            . "🏷️ <b>Mövzu:</b> " . e($inquiry->subject ?? 'Ümumi') . "\n"
            . "🆔 <b>ID:</b> #{$inquiry->id}";

        $this->send($message);
    }

    public function sendNewJobSeeker(\App\Modules\JobSeeker\Models\JobSeeker $jobSeeker): void
    {
        $message = "🧑‍💼 <b>YENİ İŞ AXTARAN ELANI</b>\n"
            . "🏷️ <b>Başlıq:</b> " . e($jobSeeker->title) . "\n"
            . "👤 <b>Əlaqə:</b> " . e($jobSeeker->contact_name) . "\n"
            . "📮 <b>E-poçt:</b> " . e($jobSeeker->contact_email ?? '-') . "\n"
            . "📞 <b>Telefon:</b> " . e($jobSeeker->contact_phone ?? '-') . "\n"
            . "🆔 <b>ID:</b> #{$jobSeeker->id}";

        $this->send($message);
    }
    public function sendWithKeyboard(string $message, array $keyboard): bool
    {
        if (! $this->token() || ! $this->chatId()) {
            Log::warning('Telegram bildirişi göndərilmədi: token və ya chat_id təyin edilməyib.');
            return false;
        }

        try {
            $response = Http::timeout(5)->post($this->apiUrl() . '/sendMessage', [
                'chat_id' => $this->chatId(),
                'text' => $message,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true,
                'reply_markup' => json_encode(['inline_keyboard' => $keyboard]),
            ]);

            return (bool) $response->json('ok', false);
        } catch (\Throwable $e) {
            Log::warning('Telegram xətası: ' . $e->getMessage());
            return false;
        }
    }

    public function sendVacancyApprovalRequest(\App\Modules\Vacancy\Models\Vacancy $vacancy): void
    {
        $message = "🆕 <b>YENİ VAKANSİYA (təsdiq gözləyir)</b>\n"
            . "💼 <b>Vəzifə:</b> " . e($vacancy->title) . "\n"
            . "🏢 <b>Şirkət:</b> " . e($vacancy->company?->name ?? '-') . "\n"
            . "📍 <b>Şəhər:</b> " . e($vacancy->city_name ?: '-') . "\n"
            . "💰 <b>Maaş:</b> " . e($vacancy->formatted_salary);

        // Vakansiya təsviri: HTML/entitilər təmizlənir, uzunluq məhdudlaşdırılır, sonra escape edilir.
        $description = trim(preg_replace('/\s+/u', ' ', strip_tags(html_entity_decode((string) $vacancy->description, ENT_QUOTES | ENT_HTML5, 'UTF-8'))));
        if ($description !== '') {
            $message .= "\n📝 <b>Təsvir:</b> " . e(\Illuminate\Support\Str::limit($description, 1200, '…'));
        }

        $message .= "\n🆔 <b>ID:</b> #{$vacancy->id}";

        $this->sendWithKeyboard($message, [
            [
                ['text' => '✅ Təsdiqlə', 'callback_data' => 'vac_approve:' . $vacancy->id],
                ['text' => '❌ Rədd et', 'callback_data' => 'vac_reject:' . $vacancy->id],
            ],
        ]);
    }

    public function answerCallbackQuery(string $callbackQueryId, string $text = ''): void
    {
        if (! $this->token()) {
            return;
        }

        try {
            Http::timeout(5)->post($this->apiUrl() . '/answerCallbackQuery', [
                'callback_query_id' => $callbackQueryId,
                'text' => $text,
            ]);
        } catch (\Throwable $e) {
            Log::warning('Telegram callback xətası: ' . $e->getMessage());
        }
    }

    public function sendToChat(string $chatId, string $message, ?array $keyboard = null): bool
    {
        if (! $this->token()) {
            return false;
        }

        $payload = ['chat_id' => $chatId, 'text' => $message, 'parse_mode' => 'HTML'];
        if ($keyboard) {
            $payload['reply_markup'] = json_encode($keyboard);
        }

        try {
            return (bool) Http::timeout(5)->post($this->apiUrl() . '/sendMessage', $payload)->json('ok', false);
        } catch (\Throwable $e) {
            Log::warning('Telegram xətası: ' . $e->getMessage());
            return false;
        }
    }

    public function setWebhook(string $url): bool
    {
        if (! $this->token()) {
            return false;
        }

        try {
            return (bool) Http::timeout(10)->post($this->apiUrl() . '/setWebhook', [
                'url' => $url,
                'allowed_updates' => ['message', 'callback_query'],
            ])->json('ok', false);
        } catch (\Throwable $e) {
            Log::warning('Telegram setWebhook xətası: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Botun komanda menyusunu qeyd edir (Telegram-da "/" yazanda görünür).
     *
     * @param  array<int, array{command: string, description: string}>  $commands
     */
    public function setMyCommands(array $commands): bool
    {
        if (! $this->token() || empty($commands)) {
            return false;
        }

        try {
            return (bool) Http::timeout(10)->post($this->apiUrl() . '/setMyCommands', [
                'commands' => $commands,
                'scope' => ['type' => 'default'],
            ])->json('ok', false);
        } catch (\Throwable $e) {
            Log::warning('Telegram setMyCommands xətası: ' . $e->getMessage());
            return false;
        }
    }
}
