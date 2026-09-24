<?php

use App\Modules\News\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::get('/xeberler', [NewsController::class, 'index'])->name('news.index');
Route::get('/xeberler/{slug}', [NewsController::class, 'show'])->name('news.show');
