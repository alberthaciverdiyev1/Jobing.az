<?php

use App\Modules\Story\Controllers\StoryController;
use Illuminate\Support\Facades\Route;

// Baxış sayı üçün giriş tələb olunmur — günlük ziyarət statistikası kimi
// hər açılış sayılır. Giriş etmiş istifadəçilər üçün "kim baxdı" da yazılır.
Route::post('/stories/{story}/view', [StoryController::class, 'view'])->name('stories.view');

Route::middleware('auth')->group(function () {
    Route::post('/stories/sync-views', [StoryController::class, 'sync'])->name('stories.sync');
});
