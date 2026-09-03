<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-gray-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @php
        // Resolve per-page SEO config (admin-managed). Falls back to static defaults when a @section overrides or no config exists.
        $curPageSeo = \App\Modules\Seo\Models\PageSeo::findForCurrentRoute();
        $seoDefaultTitle = $curPageSeo?->getTrans('title') ?: (config('app.full_name') . ' - ' . __('Modern İş İlanları və Karyera Platforması'));
        $seoDefaultDesc = $curPageSeo?->getTrans('description') ?: __('Yazılım, tasarım, ürün, veri ve pazarlama alanlarında önde gelen teknoloji şirketlerinin açık pozisyonlarına anında başvurun.');
    @endphp
    <title>@yield('title', $seoDefaultTitle)</title>
    <meta name="description" content="@yield('meta_description', $seoDefaultDesc)">
    @if($curPageSeo?->keywords && $curPageSeo->getTrans('keywords'))
    <meta name="keywords" content="{{ $curPageSeo->getTrans('keywords') }}">
    @endif
    @if($curPageSeo?->canonical_url)
    <link rel="canonical" href="{{ $curPageSeo->canonical_url }}">
    @endif

    <!-- Google Fonts: Inter & JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">

    <!-- FontAwesome 6 Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
        }
        [x-cloak] { display: none !important; }
        .glass-nav {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body class="h-full antialiased font-sans text-gray-800 flex flex-col min-h-screen selection:bg-orange-500 selection:text-white" x-data="{ mobileMenuOpen: false }">

    <!-- Flash Messages (component) -->
    <x-flash-messages />

    <!-- Header / Navbar (component) -->
    <x-navbar />

    <!-- Main Content Body -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Footer (component) -->
    <x-footer />

    @stack('scripts')
</body>
</html>
