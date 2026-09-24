<?php

use App\Modules\Home\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/hakkimizda', [HomeController::class, 'about'])->name('about');
