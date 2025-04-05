<?php

use Illuminate\Support\Facades\Route;
use Modules\Web\Http\Controllers\WebController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('web', WebController::class)->names('web');
});
