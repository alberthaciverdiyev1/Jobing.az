<?php

use App\Modules\JobSeeker\Controllers\JobSeekerController;
use Illuminate\Support\Facades\Route;

// Job Seekers (İş Arıyorum) Public Routes
Route::get('/iş-ariyorum', [JobSeekerController::class, 'index'])->name('job-seekers.index');
Route::get('/is-ariyorum', [JobSeekerController::class, 'index']);

// Job Seekers Creation - Only accessible for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::get('/iş-ariyorum/elan-ver', [JobSeekerController::class, 'create'])->name('job-seekers.create');
    Route::get('/is-ariyorum/elan-ver', [JobSeekerController::class, 'create']);
    Route::post('/iş-ariyorum/elan-ver', [JobSeekerController::class, 'store'])->name('job-seekers.store')->middleware('throttle:6,10');
    Route::post('/is-ariyorum/elan-ver', [JobSeekerController::class, 'store'])->middleware('throttle:6,10');
});

// Job Seeker Detail Page
Route::get('/iş-ariyorum/{jobSeeker:slug}', [JobSeekerController::class, 'show'])->name('job-seekers.show');
Route::get('/is-ariyorum/{jobSeeker:slug}', [JobSeekerController::class, 'show']);
