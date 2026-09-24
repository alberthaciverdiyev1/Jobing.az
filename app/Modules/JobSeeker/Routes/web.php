<?php

use App\Modules\JobSeeker\Controllers\JobSeekerController;
use Illuminate\Support\Facades\Route;

// İş Axtarıram — ictimai
Route::get('/is-ariyorum', [JobSeekerController::class, 'index'])->name('job-seekers.index');

// Elan vermə — yalnız giriş etmiş istifadəçilər
Route::middleware(['auth'])->group(function () {
    Route::get('/is-ariyorum/ilan-ver', [JobSeekerController::class, 'create'])->name('job-seekers.create');
    Route::post('/is-ariyorum/ilan-ver', [JobSeekerController::class, 'store'])->name('job-seekers.store')->middleware('throttle:6,10');
});

// Elan detalı
Route::get('/is-ariyorum/{jobSeeker:slug}', [JobSeekerController::class, 'show'])->name('job-seekers.show');
