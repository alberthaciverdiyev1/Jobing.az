<?php

use App\Modules\JobAttribute\Controllers\SkillController;
use Illuminate\Support\Facades\Route;

Route::get('/api/skills', [SkillController::class, 'byCategory'])->name('api.skills.by-category');
