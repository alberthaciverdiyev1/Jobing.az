<?php

namespace App\Modules\ActivityLog\Http\Middleware;

use App\Modules\ActivityLog\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        // Heç bir iş görmürük — qeydiyyat yanıt göndərildikdən sonra (terminate) aparılır.
        return $next($request);
    }

    /**
     * Cavab istifadəçiyə göndərildikdən SONRA işləyir → sorğu gecikməsinə təsir etmir.
     */
    public function terminate(Request $request, Response $response): void
    {
        // Yalnız mənalı GET/HEAD səhifələri; statik fayllar, health-check və botlar istisna.
        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            return;
        }

        if ($request->is('build/*', 'storage/*', 'up', 'livewire/upload*') || $request->path() === 'up') {
            return;
        }

        if ($request->expectsJson() || is_bot_request()) {
            return;
        }

        ActivityLog::record(
            action: 'page_view',
            request: $request,
            statusCode: $response->getStatusCode(),
        );
    }
}
