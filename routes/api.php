<?php

use App\Http\Middleware\VerifyJobingPostToken;
use App\Modules\Vacancy\Controllers\JobingPostApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| JobingPost iç API
|--------------------------------------------------------------------------
| Yalnızca JobingPost projesinin kullandığı, Bearer token ile korunan uçlar.
| Token: config('services.jobing_post.token') (JOBING_POST_API_TOKEN)
*/

Route::prefix('jobing-post')
    ->name('api.jobing-post.')
    ->middleware(VerifyJobingPostToken::class)
    ->group(function () {
        Route::get('/health', [JobingPostApiController::class, 'health'])->name('health');
        Route::get('/candidates', [JobingPostApiController::class, 'candidates'])->name('candidates');
        Route::get('/candidates/{id}', [JobingPostApiController::class, 'candidate'])->whereNumber('id')->name('candidate');
        Route::post('/vacancies', [JobingPostApiController::class, 'storeVacancy'])->name('vacancies.store');
        Route::put('/vacancies/{id}', [JobingPostApiController::class, 'updateVacancy'])->whereNumber('id')->name('vacancies.update');
        Route::post('/tags', [JobingPostApiController::class, 'storeTags'])->name('tags.store');
    });
