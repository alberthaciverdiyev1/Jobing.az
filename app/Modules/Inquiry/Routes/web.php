<?php

use App\Modules\Inquiry\Controllers\InquiryController;
use Illuminate\Support\Facades\Route;

Route::get('/elaqe', [InquiryController::class, 'index'])->name('contact.index');
Route::post('/elaqe', [InquiryController::class, 'store'])->name('contact.store');
