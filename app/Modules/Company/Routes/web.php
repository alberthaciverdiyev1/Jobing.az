<?php

use App\Modules\Company\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

// Şirkətlər
Route::prefix('sirketler')->name('companies.')->group(function () {
    Route::get('/', [CompanyController::class, 'index'])->name('index');
    Route::get('/{slug}', [CompanyController::class, 'show'])->name('show');
});
