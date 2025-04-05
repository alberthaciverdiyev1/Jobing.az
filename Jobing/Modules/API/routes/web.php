<?php

use Illuminate\Support\Facades\Route;
use Modules\API\Http\Controllers\APIController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('api', APIController::class)->names('api');
});
