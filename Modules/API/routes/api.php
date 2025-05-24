<?php

use Illuminate\Support\Facades\Route;
use Modules\API\Controllers\VacancyController;

    Route::apiResource('vacancy', VacancyController::class)->names('vacancy');


    //Route::group(function () {
//});
