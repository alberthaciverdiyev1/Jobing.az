<?php

use App\Modules\Inquiry\Controllers\InquiryController;
use Illuminate\Support\Facades\Route;

// Contact (İletişim / Lead)
Route::get('/contact', [InquiryController::class, 'index'])->name('contact.index');
Route::post('/contact', [InquiryController::class, 'store'])->name('contact.store');
