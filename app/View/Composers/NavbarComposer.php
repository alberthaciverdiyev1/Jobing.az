<?php

namespace App\View\Composers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class NavbarComposer
{
    public function compose(View $view): void
    {
        if (! Auth::check()) {
            $view->with('unreadCount', 0);
            $view->with('latestUserNotifs', collect());

            return;
        }

        $user = Auth::user();
        $cacheKey = 'navbar.notifications.' . $user->id;

        [$unreadCount, $notifs] = Cache::remember($cacheKey, now()->addSeconds(30), function () use ($user) {
            return [
                (int) $user->unreadNotifications()->count(),
                $user->notifications()->take(5)->get(),
            ];
        });

        $view->with('unreadCount', $unreadCount);
        $view->with('latestUserNotifs', $notifs);
    }
}
