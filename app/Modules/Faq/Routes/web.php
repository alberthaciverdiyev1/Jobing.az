<?php

use App\Modules\Faq\Controllers\FaqController;
use Illuminate\Support\Facades\Route;

Route::get('/suallar', [FaqController::class, 'index'])->name('faq.index');
