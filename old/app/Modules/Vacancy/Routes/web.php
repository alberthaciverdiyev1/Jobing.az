<?php

use App\Modules\Vacancy\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

// Vacancies (Jobs)
Route::prefix('jobs')->name('jobs.')->group(function () {
    Route::get('/', [VacancyController::class, 'index'])->name('index');
    Route::get('/create', [VacancyController::class, 'create'])->name('create');
    Route::post('/', [VacancyController::class, 'store'])->name('store');
    Route::post('/{slug}/apply', [VacancyController::class, 'apply'])->name('apply')->middleware('throttle:6,1');

    // Multi-segment URL: /jobs/{citySlug}/{categorySlug} (e.g. /jobs/baki/computer-science)
    Route::get('/{param1}/{param2}', [VacancyController::class, 'filterTwoParams'])->name('filter.two');

    // Single-segment URL: /jobs/{slug} (resolves to City, Category, or Vacancy Show)
    Route::get('/{slug}', [VacancyController::class, 'resolveSlug'])->name('show');
});

// SEO-friendly category listing URLs (/isler/{category}/{city})
Route::get('/isler/{category}/{city}', [VacancyController::class, 'seo'])->name('jobs.seo.category-city');
Route::get('/isler/{category}', [VacancyController::class, 'seo'])->name('jobs.seo.category');
