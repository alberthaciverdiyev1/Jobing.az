<?php

use App\Modules\Blog\Controllers\BlogController;
use Illuminate\Support\Facades\Route;

// Blog (Kariyer Bloğu)
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blog:slug}', [BlogController::class, 'show'])->name('blog.show');
