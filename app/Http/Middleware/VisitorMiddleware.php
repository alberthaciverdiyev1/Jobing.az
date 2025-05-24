<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Modules\API\Services\VisitorService;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class VisitorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $ip = $request->header('cf-connecting-ip') ? explode(',', $request->header('x-forwarded-for'))[0] : $request->ip();

            $userAgent = $request->header('user-agent');
            $oneHourAgo = Carbon::now()->subHour();

            $visitor = app(VisitorService::class)->findByIp($ip);

            if ($visitor) {
                if (Carbon::parse($visitor->last_visit)->lte($oneHourAgo)) {
                    app(VisitorService::class)->incrementVisitCount($ip);
                    app(VisitorService::class)->updateLastVisit($ip, $userAgent);
                }
            } else {
                app(VisitorService::class)->create([
                    'ip' => $ip,
                    'user_agent' => $userAgent,
                    'visit_count' => 1,
                    'last_visit' => now(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Error logging visitor: " . $e->getMessage());
        }

        return $next($request);
    }
}
