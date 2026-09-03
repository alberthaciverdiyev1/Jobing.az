<?php

namespace App\View\Composers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Navbar için bildirim verisini controller/servis katmanında hazırlar.
 * Böylece blade içinde doğrudan DB sorgusu yazılmaz.
 */
class NavbarComposer
{
    public function compose(View $view): void
    {
        if (Auth::check()) {
            $user = Auth::user();

            $view->with('unreadCount', (int) $user->unreadNotifications()->count());
            $view->with('latestUserNotifs', $user->notifications()->take(5)->get());
        } else {
            $view->with('unreadCount', 0);
            $view->with('latestUserNotifs', collect());
        }
    }
}
