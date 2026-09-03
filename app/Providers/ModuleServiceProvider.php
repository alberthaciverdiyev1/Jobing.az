<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Auto-loads each module's Routes/web.php so route definitions live inside
 * their own module (mirrors Metraj's modular route architecture).
 *
 * Jobing uses session-based locale switching (SetLocale middleware), so module
 * routes are registered WITHOUT a {locale} URL prefix.
 */
class ModuleServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $modulesPath = app_path('Modules');

        if (! File::isDirectory($modulesPath)) {
            return;
        }

        $modules = collect(File::directories($modulesPath));

        $modules->each(function (string $moduleDir) {
            $routesFile = $moduleDir . '/Routes/web.php';

            if (! File::isFile($routesFile)) {
                return;
            }

            Route::middleware('web')->group(function () use ($routesFile) {
                $this->loadRoutesFrom($routesFile);
            });
        });
    }
}
