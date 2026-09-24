<?php

use App\Modules\Favorite\Controllers\FavoriteController;
use Illuminate\Support\Facades\Route;

Route::get('/secilmisler', [FavoriteController::class, 'index'])->name('favorites.index');
Route::post('/api/favorites/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
Route::get('/api/favorites/ids', [FavoriteController::class, 'ids'])->name('favorites.ids');
Route::post('/api/favorites/clear', [FavoriteController::class, 'clear'])->name('favorites.clear');
