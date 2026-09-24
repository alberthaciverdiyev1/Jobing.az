<?php

use App\Modules\Faq\Controllers\FaqController;
use Illuminate\Support\Facades\Route;

// Suallar
Route::get('/sss', [FaqController::class, 'index'])->name('faq.index');
