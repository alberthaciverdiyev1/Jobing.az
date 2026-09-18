<?php

use App\Modules\Vacancy\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

// Kök, vakansiya siyahısını göstərir (jobs.index adı qorunur).
Route::get('/', [VacancyController::class, 'index'])->name('jobs.index');

// Vakansiyalar
Route::prefix('vakansiya')->name('jobs.')->group(function () {
    Route::get('/yarat', [VacancyController::class, 'create'])->name('create');
    Route::post('/', [VacancyController::class, 'store'])->name('store');
    Route::post('/{slug}/muraciet', [VacancyController::class, 'apply'])->name('apply')->middleware('throttle:6,1');

    // İki seqmentli URL: /vakansiya/{citySlug}/{categorySlug}
    Route::get('/{param1}/{param2}', [VacancyController::class, 'filterTwoParams'])->name('filter.two');

    // Tək seqmentli URL: /vakansiya/{slug}
    Route::get('/{slug}', [VacancyController::class, 'resolveSlug'])->name('show');
});

// Kök səviyyəli SEO yolları (/kateqoriya və /şəhər/kateqoriya).
// Fallback ən sonda işləyir — statik route-ları (blog, cv, admin, elaqe və s.) kölgələmir.
Route::fallback([VacancyController::class, 'fallback'])->name('jobs.fallback');
