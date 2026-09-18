<?php

use App\Modules\Promotion\Controllers\PromotionRequestController;
use Illuminate\Support\Facades\Route;

Route::post('/vakansiya/{slug}/promotion-request', [PromotionRequestController::class, 'store'])
    ->middleware(['auth', 'throttle:20,1'])
    ->name('promotion.request');
