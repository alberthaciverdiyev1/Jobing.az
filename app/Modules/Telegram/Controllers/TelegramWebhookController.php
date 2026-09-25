<?php

namespace App\Modules\Telegram\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Services\TelegramService;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TelegramWebhookController extends Controller
{
    public function handle(Request $request, TelegramService $telegram): JsonResponse
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
            $text = trim((string) $update['message']['text']);
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
}
