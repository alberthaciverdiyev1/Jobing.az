@extends('layouts.app')

@section('title', __('Daxil ol') . ' - ' . config('app.full_name'))

@section('content')
<div class="bg-gray-50 min-h-screen py-12 sm:py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-xl">

        <!-- Top Title / Logo -->
        <div class="text-center mb-8">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {{ __('Hesabınıza daxil olun') }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1.5">
                {{ __('Jobing.az portalına xoş gəlmisiniz. Zəhmət olmasa məlumatlarınızı daxil edin.') }}
            </p>
        </div>

        @if ($errors->any())
        <div class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <div class="font-bold mb-1 flex items-center gap-1.5">
                <i class="fas fa-exclamation-circle text-rose-600"></i>
                <span>{{ __('Daxil olarkən xəta baş verdi:') }}</span>
            </div>
            <ul class="list-disc pl-5 space-y-1 mt-1 text-[11px]">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <!-- Big Login Card -->
        <div class="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <form action="{{ route('login.attempt') }}" method="POST" class="space-y-5">
                @csrf

                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        {{ __('E-poçt Ünvanı') }} <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <i class="far fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input type="email" name="email" value="{{ old('email') }}" required autofocus
                               placeholder="nümunə@domain.com"
                               class="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {{ __('Şifrə') }} <span class="text-rose-500">*</span>
                        </label>
                    </div>
                    <div class="relative">
                        <i class="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input type="password" name="password" required
                               placeholder="••••••••"
                               class="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                    </div>
                </div>

                <div class="flex items-center justify-between text-xs pt-1">
                    <label class="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                        <input type="checkbox" name="remember" class="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4">
                        <span class="font-medium">{{ __('Məni xatırla') }}</span>
                    </label>
                </div>

                <button type="submit"
                        class="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm hover:shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer mt-2">
                    <i class="fas fa-sign-in-alt text-xs"></i>
                    <span>{{ __('Daxil ol') }}</span>
                </button>
            </form>

            <!-- Switch to Register Banner -->
            <div class="pt-6 border-t border-gray-100 text-center">
                <p class="text-xs text-gray-600">
                    {{ __('Hesabınız yoxdur?') }}
                </p>
                <a href="{{ route('register') }}"
                   class="inline-flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-orange-50/50 text-gray-800 hover:text-primary font-bold text-xs transition duration-150 shadow-2xs">
                    <i class="fas fa-user-plus text-primary text-xs"></i>
                    <span>{{ __('Yeni hesab yarat') }}</span>
                </a>
            </div>
        </div>

    </div>
</div>
@endsection
