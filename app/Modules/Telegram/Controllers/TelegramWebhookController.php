<?php

namespace App\Modules\Telegram\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Services\TelegramService;
use App\Modules\Vacancy\Models\Vacancy;
use App\Modules\Visitor\Services\VisitorReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TelegramWebhookController extends Controller
{
    public function handle(Request $request, TelegramService $telegram, VisitorReportService $visitorReport): JsonResponse
    {
        $update = $request->all();

        if (isset($update['callback_query'])) {
            $cb = $update['callback_query'];
            $data = (string) ($cb['data'] ?? '');
            $chatId = (string) ($cb['message']['chat']['id'] ?? '');
            $cbId = (string) ($cb['id'] ?? '');

            [$action, $vacancyId] = array_pad(explode(':', $data, 2), 2, null);
            $vacancy = $vacancyId ? Vacancy::find((int) $vacancyId) : null;

            if (! $vacancy) {
                $telegram->answerCallbackQuery($cbId, 'Vakansiya tapılmadı');

                return response()->json(['ok' => true]);
            }

            if ($action === 'vac_approve') {
                $vacancy->update(['is_active' => true, 'rejection_reason' => null]);
                $telegram->answerCallbackQuery($cbId, '✅ Təsdiqləndi');
                $telegram->sendToChat($chatId, "✅ <b>Təsdiqləndi</b>\n#{$vacancy->id} — " . e($vacancy->title));
            } elseif ($action === 'vac_reject') {
                Cache::put("telegram:reject:{$chatId}", $vacancy->id, now()->addMinutes(30));
                $telegram->answerCallbackQuery($cbId, 'Rədd səbəbini yaz');
                // ForceReply: qrupda bot "privacy mode" açıq olsa belə, bota cavab (reply)
                // olaraq göndərilən mesaj mütləq çatır. Adi düz mətn çatmır.
                $telegram->sendToChat($chatId, "❌ <b>#{$vacancy->id}</b> — rədd səbəbini bu mesaja <b>cavab (reply)</b> olaraq yazın (30 dəqiqə):", ['force_reply' => true]);
            }

            return response()->json(['ok' => true]);
        }

        if (isset($update['message']['text'])) {
            $chatId = (string) ($update['message']['chat']['id'] ?? '');
            $chatUsername = $update['message']['chat']['username'] ?? null;
            $text = trim((string) $update['message']['text']);

            // Qrupda Telegram komutu "/views@BotUsername" şəklində gələ bilər.
            $command = strtolower(ltrim(explode('@', $text)[0], '/'));

            if (in_array($command, ['views', 'stats'], true)) {
                if ($this->isAuthorizedChat($chatId, $chatUsername)) {
                    $telegram->sendToChat($chatId, $this->formatViewsReport($visitorReport->dailyReport()));

                    return response()->json(['ok' => true]);
                }

                return response()->json(['ok' => true]);
            }

            $cacheKey = "telegram:reject:{$chatId}";

            if ($vacancyId = Cache::pull($cacheKey)) {
                $vacancy = Vacancy::find((int) $vacancyId);
                if ($vacancy) {
                    $vacancy->update(['is_active' => false, 'rejection_reason' => $text]);
                    $telegram->sendToChat($chatId, "📝 <b>Rədd edildi</b>\n#{$vacancy->id} — " . e($vacancy->title) . "\n<b>Səbəb:</b> " . e($text));
                }
            }
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Yalnız konfiqurasiya olunmuş chat (admin qrupu) komutu işlədə bilər.
     * Beləliklə bot token ictimai olsa da statistikalar kənara sızmır.
     * Həm rəqəmsal chat_id, həm də @username dəstəklənir.
     */
    protected function isAuthorizedChat(string $chatId, ?string $username = null): bool
    {
        $allowed = config('services.telegram.chat_id');

        if (! $allowed) {
            return false;
        }

        $allowed = ltrim((string) $allowed, '@');

        if ($allowed === $chatId) {
            return true;
        }

        return $username !== null && strcasecmp($allowed, $username) === 0;
    }

    protected function formatViewsReport(array $report): string
    {
        $months = [1 => 'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
        $now = now();
        $dateLabel = $now->day . ' ' . $months[(int) $now->month];

        $hourBars = collect($report['hourlyStats'])->map(function ($h) {
            $visits = (int) $h->visits;
            $bar = str_repeat('▰', min($visits, 20));
            $label = str_pad((string) $h->hour, 2, '0', STR_PAD_LEFT) . ':00';

            return "{$label} {$bar} {$visits}";
        })->implode("\n");

        $topIps = collect($report['topIps'])->values()->map(function ($v, $i) {
            $agent = e(substr((string) ($v->user_agent ?? '-'), 0, 40));

            return ($i + 1) . ". <code>" . e($v->ip) . "</code> — {$v->visit_count} dəfə | {$agent}";
        })->implode("\n");

        $diff = $report['today']['totalVisits'] - $report['yesterday']['totalVisits'];
        $diffSign = $diff >= 0 ? "📈 +{$diff}" : "📉 {$diff}";

        return "📊 <b>Günlük Visitor Hesabatı</b>\n"
            . "━━━━━━━━━━━━━━━━━━━\n\n"
            . "🟢 <b>Onlayn (son 5 dəq):</b> {$report['online']}\n\n"
            . "👤 <b>Bugün</b> ({$dateLabel})\n"
            . "• Ziyarət: {$report['today']['totalVisits']}\n"
            . "• Unikal IP: {$report['today']['uniqueVisitors']}\n"
            . "• Dünənlə fərq: {$diffSign}\n\n"
            . "📅 <b>Dünən</b>\n"
            . "• Ziyarət: {$report['yesterday']['totalVisits']}\n"
            . "• Unikal IP: {$report['yesterday']['uniqueVisitors']}\n\n"
            . "📆 <b>Son 7 gün:</b> {$report['weekly']['totalVisits']} ziyarət\n"
            . "🏛️ <b>Ümumi:</b> {$report['allTime']['totalVisits']} ziyarət, {$report['allTime']['totalUnique']} unikal IP\n\n"
            . "🕐 <b>Saatlıq bölgü:</b>\n"
            . ($hourBars !== '' ? $hourBars : 'Məlumat yoxdur') . "\n\n"
            . "🔝 <b>Ən aktiv IP-lər (bugün):</b>\n"
            . ($topIps !== '' ? $topIps : 'Məlumat yoxdur') . "\n\n"
            . "⏰ Yenilənmə: " . $now->format('H:i');
    }
}
