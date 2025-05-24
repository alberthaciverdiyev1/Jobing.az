<?php

use Illuminate\Support\Facades\Route;
use Modules\Web\Http\Controllers\WebController;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;


use App\Http\Middleware\VisitorMiddleware;

Route::middleware(['visitor_logger'])->group(function () {
    Route::group([
//        'prefix' => LaravelLocalization::getCurrentLocale(),
//        'middleware' => ['localize']
    ], function () {
        Route::get('/', [WebController::class, 'home'])->name('home');
        Route::get('/faq', [WebController::class, 'faq'])->name('faq');
        Route::get('/contact-us', [WebController::class, 'contact'])->name('contact');
        Route::get('/about-us', [WebController::class, 'about'])->name('about');

        Route::get('/blogs', [WebController::class, 'blogs'])->name('blogs');
        Route::get('/blogs/{slug}', [WebController::class, 'blog'])->name('blog');

        Route::get('/vakansiyalar', [WebController::class, 'vacancies'])->name('vacancies');
        Route::get('/vakansiyalar/{slug}', [WebController::class, 'vacancy'])->name('vacancy');
        Route::match(['post', 'get'], '/add-vacancy', [WebController::class, 'addVacancy'])->name('add_vacancy');
    });
});
