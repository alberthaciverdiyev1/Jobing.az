<?php

use App\Modules\Auth\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Giriş / Qeydiyyat
Route::middleware('guest')->group(function () {
    Route::get('/giris', [AuthController::class, 'showLogin'])->name('login');
    // Brute-force qoruması: dəqiqədə ən çoxu 6 cəhd.
    Route::post('/giris', [AuthController::class, 'login'])->middleware('throttle:6,1')->name('login.attempt');
    Route::get('/kayit', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/kayit', [AuthController::class, 'register'])->middleware('throttle:6,1')->name('register.attempt');
});

Route::post('/cikis', [AuthController::class, 'logout'])->middleware('auth')->name('logout');
