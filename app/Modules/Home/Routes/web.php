<?php

use App\Modules\Home\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

// Haqqımızda (kök route Vacancy modulundadır və vakansiya siyahısını göstərir).
Route::get('/hakkimizda', [HomeController::class, 'about'])->name('about');
