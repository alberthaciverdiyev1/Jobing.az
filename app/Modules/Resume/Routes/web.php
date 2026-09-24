<?php

use App\Modules\Resume\Controllers\ResumeController;
use Illuminate\Support\Facades\Route;

// CV-lər
Route::get('/ozgecmis', [ResumeController::class, 'index'])->name('resumes.index');
Route::get('/ozgecmis/{resume}', [ResumeController::class, 'show'])->name('resumes.show');
