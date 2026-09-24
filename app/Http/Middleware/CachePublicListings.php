<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CachePublicListings
{
    private const TOKEN_PLACEHOLDER = '__KIBRISKARE_CSRF_TOKEN__';

    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->shouldCache($request)) {
            return $next($request);
        }

        $key = 'http.public-listing.' . hash('sha256', implode('|', [
            app()->getLocale(),
            $request->fullUrl(),
            $request->ajax() || $request->wantsJson() ? 'json' : 'html',
        ]));

        if ($cached = Cache::get($key)) {
            return response(str_replace(self::TOKEN_PLACEHOLDER, csrf_token(), $cached['content']), 200, [
                'Content-Type' => $cached['content_type'],
                'Vary' => 'X-Requested-With, Accept',
                'X-Response-Cache' => 'HIT',
            ]);
        }

        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            Cache::put($key, [
                'content' => str_replace(csrf_token(), self::TOKEN_PLACEHOLDER, $response->getContent()),
                'content_type' => $response->headers->get('Content-Type', 'text/html; charset=UTF-8'),
            ], 30);
            $response->headers->set('X-Response-Cache', 'MISS');
        }

        return $response;
    }

    private function shouldCache(Request $request): bool
    {
        return $request->isMethod('GET')
            && ! auth()->check()
            && $request->routeIs([
                'jobs.index',
                'jobs.filter.*',
                'jobs.fallback',
                'companies.index',
                'job-seekers.index',
                'resumes.index',
                'blog.index',
            ]);
    }
}
