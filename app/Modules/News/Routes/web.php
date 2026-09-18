<?php

use App\Modules\News\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

// Xəbərlər
Route::get('/xeberler', [NewsController::class, 'index'])->name('news.index');
Route::get('/xeberler/{slug}', [NewsController::class, 'show'])->name('news.show');
