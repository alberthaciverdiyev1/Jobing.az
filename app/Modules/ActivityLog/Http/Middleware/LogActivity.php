<?php

namespace App\Modules\ActivityLog\Http\Middleware;

use App\Modules\ActivityLog\Jobs\ProcessActivityLogJob;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $uri = $request->getRequestUri();

        foreach ([
            '/filament/assets/', '/livewire/livewire.js', '/livewire/update', '/livewire/preview-file',
            '/assets/', '/storage/', '/vendor/', '/favicon.ico', '/robots.txt',
            '/_debugbar/', '/telescope/', '/build/', '/up',
        ] as $noise) {
            if (str_contains($uri, $noise)) {
                return $response;
            }
        }

        $durationMs = (int) round((microtime(true) - $startTime) * 1000);
        $userAgent = $request->userAgent() ?? '';
        $path = $request->getPathInfo();
        $statusCode = $response->getStatusCode();

        $botName = null;
        if (preg_match('/(googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebot|facebookexternalhit|twitterbot|telegrambot|ahrefsbot|semrushbot|gptbot|applebot)/i', $userAgent, $m)) {
            $botName = ucfirst(strtolower($m[1]));
        }

        if ($botName) {
            $action = 'bot_visit';
        } elseif ($statusCode >= 500) {
            $action = 'server_error';
        } elseif ($statusCode === 404) {
            $action = 'not_found_404';
        } elseif (str_starts_with($path, '/admin')) {
            $action = $request->isMethod('GET') ? 'admin_view' : 'admin_action';
        } elseif (str_starts_with($path, '/company')) {
            $action = $request->isMethod('GET') ? 'company_view' : 'company_action';
        } elseif (str_starts_with($path, '/user')) {
            $action = $request->isMethod('GET') ? 'user_view' : 'user_action';
        } elseif ($request->isMethod('GET')) {
            if (array_intersect(array_keys($request->query()), ['q', 'category', 'subcategory', 'city', 'type', 'workplace', 'experience', 'sort'])) {
                $action = 'search_filter';
            } elseif (str_starts_with($path, '/vakansiya/') && $path !== '/vakansiya/yarat') {
                $action = 'vacancy_view';
            } elseif (str_starts_with($path, '/sirketler/')) {
                $action = 'company_page_view';
            } elseif (str_starts_with($path, '/blog/')) {
                $action = 'blog_view';
            } elseif (str_starts_with($path, '/cv/')) {
                $action = 'resume_view';
            } elseif (str_starts_with($path, '/is-axtariram/')) {
                $action = 'jobseeker_view';
            } else {
                $action = 'page_view';
            }
        } elseif ($request->isMethod('POST')) {
            $action = 'form_submit';
        } elseif (in_array($request->method(), ['PUT', 'PATCH'], true)) {
            $action = 'data_update';
        } elseif ($request->isMethod('DELETE')) {
            $action = 'data_delete';
        } else {
            $action = 'request';
        }

        $payload = [];

        if ($botName) {
            $payload['bot_name'] = $botName;
        }
        if (! empty($request->query())) {
            $payload['query_params'] = $request->query();
        }
        if (! $request->isMethod('GET')) {
            $payload['input'] = $request->except([
                'password', 'password_confirmation', 'current_password', '_token', '_method',
                'image', 'images', 'cover_image', 'avatar', 'logo', 'banner', 'file', 'files', 'photo',
            ]);
        }
        if (auth()->check()) {
            $user = auth()->user();
            $payload['user_name'] = $user->name;
            $payload['user_email'] = $user->email;
            $payload['user_role'] = $user->is_admin ? 'Admin' : ($user->isCompany() ? 'Company' : 'User');
        }

        $logData = [
            'user_id' => auth()->id(),
            'ip_address' => $request->header('CF-Connecting-IP') ?? $request->header('X-Forwarded-For') ?? $request->ip(),
            'cf_country' => $request->header('CF-IPCountry'),
            'user_agent' => $userAgent,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'referer' => $request->header('referer'),
            'action' => $action,
            'payload' => $payload ?: null,
            'duration_ms' => $durationMs,
            'status_code' => $statusCode,
            'created_at' => now()->toDateTimeString(),
        ];

        try {
            dispatch(new ProcessActivityLogJob($logData))->afterResponse();
        } catch (\Throwable $e) {
        }

        return $response;
    }
}
