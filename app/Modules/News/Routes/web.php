<?php

use App\Modules\News\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::get('/haberler', [NewsController::class, 'index'])->name('news.index');
Route::get('/haberler/{slug}', [NewsController::class, 'show'])->name('news.show');
