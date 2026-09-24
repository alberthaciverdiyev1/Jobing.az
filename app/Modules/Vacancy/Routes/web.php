<?php

use App\Modules\Vacancy\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

Route::get('/', [VacancyController::class, 'index'])->name('jobs.index');

Route::get('/diger-sitelerden', [VacancyController::class, 'external'])->name('jobs.external');

// Vakansiyalar
Route::prefix('ilanlar')->name('jobs.')->group(function () {
    Route::get('/olustur', [VacancyController::class, 'create'])->name('create');
    Route::post('/', [VacancyController::class, 'store'])->name('store');
    Route::post('/{slug}/basvuru', [VacancyController::class, 'apply'])->name('apply')->middleware('throttle:6,1');

    // İki seqmentli URL: /vakansiya/{citySlug}/{categorySlug}
    Route::get('/{param1}/{param2}', [VacancyController::class, 'filterTwoParams'])->name('filter.two');

    Route::get('/{slug}', [VacancyController::class, 'resolveSlug'])->name('show');
});

Route::fallback([VacancyController::class, 'fallback'])->name('jobs.fallback');
