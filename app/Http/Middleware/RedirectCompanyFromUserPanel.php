<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectCompanyFromUserPanel
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('user*') && auth()->check() && auth()->user()->isCompany() && !auth()->user()->is_admin) {
            return redirect('/company');
        }

        return $next($request);
    }
}
