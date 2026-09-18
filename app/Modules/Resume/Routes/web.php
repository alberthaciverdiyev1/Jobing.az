<?php

use App\Modules\Resume\Controllers\ResumeController;
use Illuminate\Support\Facades\Route;

// CV-lər
Route::get('/cv', [ResumeController::class, 'index'])->name('resumes.index');
Route::get('/cv/{resume}', [ResumeController::class, 'show'])->name('resumes.show');
