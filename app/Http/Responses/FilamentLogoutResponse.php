<?php

namespace App\Http\Responses;

use Filament\Http\Responses\Auth\Contracts\LogoutResponse as Responsable;
use Illuminate\Http\RedirectResponse;
use Livewire\Features\SupportRedirects\Redirector;

/**
 * Filament panellerinden çıkış yapınca panelin kendi login sayfası yerine
 * sitenin giriş sayfasına yönlendirir. (Filament login'i devre dışı.)
 */
class FilamentLogoutResponse implements Responsable
{
    public function toResponse($request): RedirectResponse | Redirector
    {
        return redirect()->route('login');
    }
}
