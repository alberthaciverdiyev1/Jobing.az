<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

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
