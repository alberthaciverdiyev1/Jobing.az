<?php

use App\Modules\ActivityLog\Http\Middleware\LogActivity;
use App\Modules\Localization\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withCommands([
        \App\Modules\News\Console\ImportNewsCommand::class,
        \App\Modules\Telegram\Console\SetWebhookCommand::class,
    ])
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            SetLocale::class,
            LogActivity::class,
            \App\Modules\Visitor\Http\Middleware\LogVisitor::class,
            \App\Http\Middleware\RedirectCompanyFromUserPanel::class,
        ]);

        // Telegram webhook xarici POST-dur → CSRF-dən azad.
        $middleware->validateCsrfTokens(except: ['api/telegram/webhook']);

        $middleware->alias([
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'guest' => \Illuminate\Auth\Middleware\RedirectIfAuthenticated::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, \Illuminate\Http\Request $request) {
            if ($e->getStatusCode() === 403 && $request->is('user*') && auth()->check() && auth()->user()->isCompany() && !auth()->user()->is_admin) {
                return redirect('/company');
            }
        });

        // Bütün gözlənilməz xətaları ayrı log bazasına yaz (404/validasiya istisna).
        $exceptions->report(function (\Throwable $e): void {
            if ($e instanceof \Illuminate\Http\Exceptions\HttpResponseException
                || $e instanceof \Illuminate\Validation\ValidationException
                || $e instanceof \Illuminate\Auth\AuthenticationException
                || $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException
                || $e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
                || $e instanceof \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException) {
                return;
            }

            \App\Modules\SystemLog\Services\SystemLog::exception($e);
        });
    })->create();
