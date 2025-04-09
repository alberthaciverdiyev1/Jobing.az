<?php

use Illuminate\Support\Facades\Route;
use Modules\Vacancy\Http\Controllers\VacancyController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('vacancy', VacancyController::class)->names('vacancy');
});
