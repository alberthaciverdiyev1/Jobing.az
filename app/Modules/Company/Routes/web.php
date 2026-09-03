<?php

use App\Modules\Company\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

// Companies
Route::prefix('companies')->name('companies.')->group(function () {
    Route::get('/', [CompanyController::class, 'index'])->name('index');
    Route::get('/{slug}', [CompanyController::class, 'show'])->name('show');
});
