<?php

use App\Modules\Telegram\Controllers\TelegramWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/api/telegram/webhook', [TelegramWebhookController::class, 'handle'])->name('telegram.webhook');
