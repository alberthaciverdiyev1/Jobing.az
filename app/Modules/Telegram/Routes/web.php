<?php

use App\Modules\Telegram\Controllers\TelegramWebhookController;
use Illuminate\Support\Facades\Route;

// Telegram webhook (CSRF istisna — bootstrap/app.php-də qeyd olunub).
Route::post('/api/telegram/webhook', [TelegramWebhookController::class, 'handle'])->name('telegram.webhook');
