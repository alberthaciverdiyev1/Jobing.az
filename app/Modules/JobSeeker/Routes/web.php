<?php

use App\Modules\JobSeeker\Controllers\JobSeekerController;
use Illuminate\Support\Facades\Route;

Route::get('/is-axtariram', [JobSeekerController::class, 'index'])->name('job-seekers.index');

Route::middleware(['auth'])->group(function () {
    Route::get('/is-axtariram/elan-ver', [JobSeekerController::class, 'create'])->name('job-seekers.create');
    Route::post('/is-axtariram/elan-ver', [JobSeekerController::class, 'store'])->name('job-seekers.store')->middleware('throttle:6,10');
});

Route::get('/is-axtariram/{jobSeeker:slug}', [JobSeekerController::class, 'show'])->name('job-seekers.show');
