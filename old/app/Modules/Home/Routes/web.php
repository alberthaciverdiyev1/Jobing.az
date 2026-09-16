<?php

use App\Modules\Home\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

// Home
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/haqqimizda', [HomeController::class, 'about'])->name('about');
Route::get('/about', [HomeController::class, 'about']);
