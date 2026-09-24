<?php

use App\Modules\Inquiry\Controllers\InquiryController;
use Illuminate\Support\Facades\Route;

// Əlaqə
Route::get('/iletisim', [InquiryController::class, 'index'])->name('contact.index');
Route::post('/iletisim', [InquiryController::class, 'store'])->name('contact.store');
