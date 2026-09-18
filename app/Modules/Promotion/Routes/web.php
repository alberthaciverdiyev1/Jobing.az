<?php

use App\Modules\Promotion\Controllers\PromotionRequestController;
use Illuminate\Support\Facades\Route;

// Şirkət premium / irəli çək sorğusu göndərir (WhatsApp-dan əvvəl qeyd olunur).
Route::post('/promotion-request', [PromotionRequestController::class, 'store'])
    ->middleware(['auth', 'throttle:20,1'])
    ->name('promotion.request');
