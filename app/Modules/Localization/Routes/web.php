<?php

use App\Modules\Localization\Controllers\LanguageController;
use Illuminate\Support\Facades\Route;

// Language Switcher (4 Languages: AZ, TR, EN, RU)
Route::get('/lang/{locale}', [LanguageController::class, 'switch'])->name('lang.switch');
