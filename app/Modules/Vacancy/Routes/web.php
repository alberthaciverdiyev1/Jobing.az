<?php

use App\Modules\Vacancy\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

// Vacancies (Jobs)
Route::prefix('jobs')->name('jobs.')->group(function () {
    Route::get('/', [VacancyController::class, 'index'])->name('index');
    Route::get('/create', [VacancyController::class, 'create'])->name('create');
    Route::post('/', [VacancyController::class, 'store'])->name('store');
    Route::get('/{slug}', [VacancyController::class, 'show'])->name('show');
    Route::post('/{slug}/apply', [VacancyController::class, 'apply'])->name('apply');
});

// SEO-friendly category listing URLs (/isler/{category}/{city})
Route::get('/isler/{category}/{city}', [VacancyController::class, 'seo'])->name('jobs.seo.category-city');
Route::get('/isler/{category}', [VacancyController::class, 'seo'])->name('jobs.seo.category');
