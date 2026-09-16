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
        $response = $next($request);

        // Only log meaningful GET/HEAD pages, skip static assets and health checks.
        if (in_array($request->method(), ['GET', 'HEAD'], true)
            && ! $request->is('build/*', 'storage/*', 'up', 'livewire/upload*')
            && $request->path() !== 'up'
            && ! $request->expectsJson()
        ) {
            ActivityLog::record(
                action: 'page_view',
                request: $request,
                statusCode: $response->getStatusCode(),
            );
        }

        return $response;
    }
}
