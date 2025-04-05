<?php

use Illuminate\Support\Facades\Route;
use Modules\API\Http\Controllers\APIController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('api', APIController::class)->names('api');
});
