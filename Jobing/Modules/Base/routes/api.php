<?php

use Illuminate\Support\Facades\Route;
use Base\app\Controllers\VacancyController;

Route::group([
    'middleware' => 'check_internal_token',
], function () {
    Route::apiResource('vacancy', VacancyController::class)->names('vacancy');
});


//Route::group(function () {
//});
