<?php

namespace App\Modules\Visitor\Http\Middleware;

use App\Modules\Visitor\Models\Visitor;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogVisitor
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        if (! in_array($request->method(), ['GET', 'HEAD'], true)) {
            return;
        }

        $path = $request->getRequestUri();
        foreach (['/admin', '/company', '/user', '/filament', '/livewire', '/build/', '/storage/', '/vendor/', '/favicon', '/robots', '/up'] as $skip) {
            if (str_contains($path, $skip)) {
                return;
            }
        }

        if (is_bot_request()) {
            return;
        }

        $ip = $request->header('CF-Connecting-IP') ?? $request->ip();
        if (empty($ip)) {
            return;
        }

        try {
            $visitor = Visitor::where('ip', $ip)->first();

            if (! $visitor) {
                Visitor::create([
                    'ip' => $ip,
                    'user_agent' => substr((string) $request->userAgent(), 0, 500),
                    'visit_count' => 1,
                    'last_visit' => now(),
                ]);

                return;
            }

            if (! $visitor->last_visit || $visitor->last_visit->lt(now()->subHour())) {
                $visitor->increment('visit_count');
                $visitor->update(['last_visit' => now(), 'user_agent' => substr((string) $request->userAgent(), 0, 500)]);
            }
        } catch (\Throwable $e) {
        }
    }
}
