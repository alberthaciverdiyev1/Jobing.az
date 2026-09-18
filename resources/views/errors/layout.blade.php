<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', __('Error')) - {{ config('app.full_name') }}</title>
    <meta name="robots" content="noindex, nofollow">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Space+Grotesk:wght@400..700&family=JetBrains+Mono:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

    @if (file_exists(public_path('build/manifest.json')))
        @vite(['resources/css/app.css'])
    @endif

    <style>
        body { background-color: #f9fafb; }
    </style>
</head>
<body class="h-full antialiased font-sans text-gray-800">
    <div class="min-h-screen flex flex-col items-center justify-center px-6 py-16">

        {{-- Marka (wordmark) --}}
        <a href="{{ url('/') }}" class="mb-10 flex items-center">
            <span class="font-semibold text-2xl text-dark tracking-tight">{{ config('app.brand_name') }}<span class="text-primary">{{ config('app.brand_suffix') }}</span></span>
        </a>

        <div class="w-full max-w-xl text-center">
            <div class="text-[5.5rem] sm:text-[7rem] font-bold leading-none text-primary tracking-tight">
                @yield('code')
            </div>

            <h1 class="mt-5 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                @yield('title')
            </h1>

            <p class="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-md mx-auto">
                @yield('message')
            </p>

            <div class="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <a href="{{ url('/') }}"
                   class="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-sm">
                    <i class="fas fa-house text-xs"></i>
                    <span>{{ __('Back to home') }}</span>
                </a>
                <a href="javascript:history.back()"
                   class="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-sm">
                    <i class="fas fa-arrow-left text-xs"></i>
                    <span>{{ __('Go back') }}</span>
                </a>
            </div>
        </div>

        <p class="mt-14 text-xs text-gray-400">
            &copy; {{ date('Y') }} {{ config('app.full_name') }}
        </p>
    </div>
</body>
</html>
