<?php

use Illuminate\Support\Facades\Route;
use Modules\Web\Http\Controllers\HomeController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('web', HomeController::class)->names('web');
});
