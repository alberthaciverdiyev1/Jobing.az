<?php

use Illuminate\Support\Facades\Route;
use Modules\Web\Http\Controllers\HomeController;

    Route::get('/', [HomeController::class,'index'])->name('home');
