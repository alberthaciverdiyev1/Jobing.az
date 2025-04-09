<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckInternalTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $providedToken = $request->header('X-Internal-Token');
        $expectedToken = config('app.internal_token');

        if ($providedToken !== $expectedToken) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
