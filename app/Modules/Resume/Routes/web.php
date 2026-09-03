<?php

use App\Modules\Resume\Controllers\ResumeController;
use Illuminate\Support\Facades\Route;

Route::get('/cv-ler', [ResumeController::class, 'index'])->name('resumes.index');
Route::get('/resumes', [ResumeController::class, 'index']);
Route::get('/cv/{resume}', [ResumeController::class, 'show'])->name('resumes.show');
