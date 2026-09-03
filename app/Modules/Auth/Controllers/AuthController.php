<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function showLogin(): View
    {
        return view('pages.auth.login');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');

        if (!$this->authService->login($credentials, $request->boolean('remember'))) {
            return back()
                ->withErrors(['email' => __('E-poçt və ya şifrə yanlışdır.')])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended($this->authService->getRedirectPath());
    }

    public function showRegister(): View
    {
        return view('pages.auth.register');
    }

    public function register(RegisterRequest $request): RedirectResponse
    {
        $user = $this->authService->register($request->validated());

        Auth::login($user);

        $request->session()->regenerate();

        return redirect($this->authService->getRedirectPath())
            ->with('success', __('Hesabınız uğurla yaradıldı!'));
    }

    public function logout(): RedirectResponse
    {
        $this->authService->logout();

        return redirect()->route('home');
    }
}
