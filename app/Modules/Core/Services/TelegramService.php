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

    /**
     * Send a plain text message to the configured admin chat/group.
     * Silently fails (logs warning) when not configured.
     */
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

    /**
     * Notify admins of a new job application.
     */
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

    /**
     * Notify admins of a new contact/lead submission.
     */
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

    /**
     * Notify admins of a new job-seeker ad.
     */
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
}
