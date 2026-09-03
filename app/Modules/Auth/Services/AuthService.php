<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use App\Modules\Company\Models\Company;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Attempt to log the user in.
     *
     * @return bool whether authentication succeeded
     */
    public function login(array $credentials, bool $remember = false): bool
    {
        return Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ], $remember);
    }

    /**
     * Register a new user (individual or company).
     * Company registration is kept minimal; the rest can be filled later.
     *
     * @return User
     */
    public function register(array $data): User
    {
        $type = $data['user_type'] ?? 'user';

        $userData = [
            'name' => $type === 'company' ? ($data['company_name'] ?? '') : ($data['name'] ?? ''),
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'user_type' => $type,
        ];

        if ($type === 'company') {
            // Create a minimal company record (only what we asked at registration).
            $company = Company::firstOrCreate(
                ['name' => $data['company_name']],
                ['email' => $data['email'], 'is_verified' => false]
            );

            $userData['company_id'] = $company->id;
        }

        return User::create($userData);
    }

    /**
     * Determine where to send the user after login/registration.
     */
    public function getRedirectPath(): string
    {
        $user = Auth::user();

        if (!$user) {
            return route('home');
        }

        if ($user->is_admin) {
            return '/admin';
        }

        if ($user->isCompany()) {
            return '/company';
        }

        return '/user';
    }

    public function logout(): void
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}
