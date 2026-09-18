<?php

use App\Modules\ContactReveal\Controllers\ContactRevealController;
use Illuminate\Support\Facades\Route;

// Contact Reveal (lead tracking) — yalnızca giriş yapmış kullanıcılar; uçlar throttle'lı.
Route::middleware(['auth', 'throttle:30,1'])->group(function () {
    Route::post('/api/reveal/job-seeker/{id}', [ContactRevealController::class, 'revealJobSeeker'])
        ->name('contact-reveal.job-seeker');
    Route::post('/api/reveal/vacancy/{id}', [ContactRevealController::class, 'revealVacancy'])
        ->name('contact-reveal.vacancy');
});
