<?php

use App\Modules\Story\Controllers\StoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('/stories/sync-views', [StoryController::class, 'sync'])->name('stories.sync');
    Route::post('/stories/{story}/view', [StoryController::class, 'view'])->name('stories.view');
});
