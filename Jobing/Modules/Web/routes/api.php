<?php

use Illuminate\Support\Facades\Route;
use Modules\Web\Http\Controllers\WebController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('web', WebController::class)->names('web');
});
