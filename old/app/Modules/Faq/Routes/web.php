<?php

use App\Modules\Faq\Controllers\FaqController;
use Illuminate\Support\Facades\Route;

// FAQ (Sıkça Sorulan Sorular)
Route::get('/faq', [FaqController::class, 'index'])->name('faq.index');
Route::get('/sikca-sorulan-sorular', [FaqController::class, 'index']);
