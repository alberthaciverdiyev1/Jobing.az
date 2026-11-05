<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyJobingPostToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = (string) config('services.jobing_post.token');

        if ($expected === '') {
            return response()->json(['message' => 'JobingPost API token is not configured.'], 503);
        }

        $provided = (string) $request->bearerToken();

        if (! hash_equals($expected, $provided)) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        return $next($request);
    }
}
