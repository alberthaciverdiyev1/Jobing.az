<?php

use App\Modules\Auth\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Giriş / Qeydiyyat
Route::middleware('guest')->group(function () {
    Route::get('/daxil-ol', [AuthController::class, 'showLogin'])->name('login');
    // Brute-force qoruması: dəqiqədə ən çoxu 6 cəhd.
    Route::post('/daxil-ol', [AuthController::class, 'login'])->middleware('throttle:6,1')->name('login.attempt');
    Route::get('/qeydiyyat', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/qeydiyyat', [AuthController::class, 'register'])->middleware('throttle:6,1')->name('register.attempt');
});

Route::post('/cixis', [AuthController::class, 'logout'])->middleware('auth')->name('logout');
