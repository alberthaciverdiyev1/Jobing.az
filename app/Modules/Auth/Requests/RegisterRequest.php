<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_type' => 'required|in:user,company',
            'name' => 'required_if:user_type,user|nullable|string|max:255',
            'company_name' => 'required_if:user_type,company|nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required_if' => __('Enter your full name.'),
            'company_name.required_if' => __('Enter the company name.'),
            'email.unique' => __('This email is already registered.'),
            'password.min' => __('Password must be at least 8 characters.'),
            'password.confirmed' => __('Passwords do not match.'),
        ];
    }
}
