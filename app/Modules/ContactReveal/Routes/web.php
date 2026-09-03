<?php

use App\Modules\ContactReveal\Controllers\ContactRevealController;
use Illuminate\Support\Facades\Route;

// Contact Reveal (lead tracking, throttled)
Route::post('/api/reveal/job-seeker/{id}', [ContactRevealController::class, 'revealJobSeeker'])
    ->name('contact-reveal.job-seeker')
    ->middleware('throttle:30,1');
Route::post('/api/reveal/vacancy/{id}', [ContactRevealController::class, 'revealVacancy'])
    ->name('contact-reveal.vacancy')
    ->middleware('throttle:30,1');
