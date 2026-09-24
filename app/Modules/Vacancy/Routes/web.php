<?php

use App\Modules\Vacancy\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

Route::get('/', [VacancyController::class, 'index'])->name('jobs.index');

Route::get('/diger-saytlardan', [VacancyController::class, 'external'])->name('jobs.external');

Route::prefix('vakansiya')->name('jobs.')->group(function () {
    Route::get('/yarat', [VacancyController::class, 'create'])->name('create');
    Route::post('/', [VacancyController::class, 'store'])->name('store');
    Route::post('/{slug}/muraciet', [VacancyController::class, 'apply'])->name('apply')->middleware('throttle:6,1');

    Route::get('/{param1}/{param2}', [VacancyController::class, 'filterTwoParams'])->name('filter.two');

    Route::get('/{slug}', [VacancyController::class, 'resolveSlug'])->name('show');
});

Route::fallback([VacancyController::class, 'fallback'])->name('jobs.fallback');
