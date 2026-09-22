<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-gray-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @php
        // Səhifə SEO (admin idarə edir) + qlobal SEO tənzimləmələri.
        $curPageSeo = \App\Modules\Seo\Models\PageSeo::findForCurrentRoute();
        $seoConf = \App\Modules\Seo\Models\SeoSetting::current();

        // @section ilə override varsa onu, yoxsa PageSeo → SeoSetting → default sırası ilə.
        $sectionOr = function (string $key, $fallback) {
            if (View::hasSection($key)) {
                $value = trim((string) View::getSection($key));
                if ($value !== '') {
                    return $value;
                }
            }

            return $fallback;
        };

        // OG şəkli: URL verilibsə olduğu kimi, yoxsa storage yolu kimi istifadə olunur.
        $toOgUrl = function (?string $value) {
            if (empty($value)) {
                return null;
            }

            return \Illuminate\Support\Str::startsWith($value, ['http://', 'https://'])
                ? $value
                : asset('storage/' . ltrim($value, '/'));
        };

        $resolvedTitle = $sectionOr('title', $curPageSeo?->getTrans('title') ?: ($seoConf?->getTrans('default_meta_title') ?: config('app.full_name')));
        $resolvedH1 = $sectionOr('h1', $curPageSeo?->getTrans('h1') ?: $resolvedTitle);
        $resolvedDescription = $sectionOr('meta_description', $curPageSeo?->getTrans('description') ?: $seoConf?->getTrans('default_meta_description'));
        $resolvedKeywords = $sectionOr('meta_keywords', $curPageSeo?->getTrans('keywords') ?: $seoConf?->getTrans('default_meta_keywords'));
        $resolvedOgImage = $sectionOr('og_image', $toOgUrl($curPageSeo?->og_image) ?: ($toOgUrl($seoConf?->og_image) ?: asset('favicon.ico')));
        $resolvedOgType = $sectionOr('og_type', 'website');
    @endphp

    <title>{{ $resolvedTitle }}</title>
    <link rel="canonical" href="{{ $curPageSeo?->canonical_url ?: url()->current() }}">

    @if($resolvedDescription)
    <meta name="description" content="{{ $resolvedDescription }}">
    @endif
    @if($resolvedKeywords)
    <meta name="keywords" content="{{ $resolvedKeywords }}">
    @endif

    <!-- Open Graph / Twitter -->
    <meta property="og:site_name" content="{{ config('app.full_name') }}">
    <meta property="og:type" content="{{ $resolvedOgType }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $resolvedTitle }}">
    @if($resolvedDescription)
    <meta property="og:description" content="{{ $resolvedDescription }}">
    @endif
    <meta property="og:image" content="{{ $resolvedOgImage }}">
    <meta property="og:locale" content="{{ app()->getLocale() }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $resolvedTitle }}">
    @if($resolvedDescription)
    <meta name="twitter:description" content="{{ $resolvedDescription }}">
    @endif
    <meta name="twitter:image" content="{{ $resolvedOgImage }}">

    @stack('structured_data')

    <!-- Google Fonts: Space Grotesk (headings), Instrument Sans (body), JetBrains Mono (prices/code) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Space+Grotesk:wght@400..700&family=JetBrains+Mono:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">

    <!-- Favicons -->
    <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicons/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/favicons/favicon-16x16.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/favicons/apple-touch-icon.png') }}">
    <link rel="manifest" href="{{ asset('images/favicons/site.webmanifest') }}">

    <!-- FontAwesome 6 Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            background-color: #f9fafb;
        }
        [x-cloak] { display: none !important; }
    </style>

    {{-- Qlobal <head> skriptləri (admin paneldən, RAW) — GA, GTM, Pixel və s. --}}
    @if(!empty($seoConf?->head_scripts))
        {!! $seoConf->head_scripts !!}
    @endif
</head>
<body class="h-full antialiased font-sans text-gray-800 flex flex-col min-h-screen selection:bg-orange-500 selection:text-white" x-data="{ mobileDrawerOpen: false }">

    {{-- Qlobal <body> skriptləri (RAW) — məs. GTM <noscript> --}}
    @if(!empty($seoConf?->body_scripts))
        {!! $seoConf->body_scripts !!}
    @endif

    <!-- Flash Messages (component) -->
    <x-flash-messages />

    <!-- Header / Navbar (component) -->
    <x-navbar />

    <!-- Main Content Body -->
    <main class="flex-grow pb-16 xl:pb-0">
        @if(!empty($resolvedH1))
        <h1 class="sr-only">{{ $resolvedH1 }}</h1>
        @endif
        @yield('content')
    </main>

    <!-- Footer (component) -->
    <x-footer />

    @stack('scripts')

    {{-- Qlobal footer / </body> skriptləri (RAW) — canlı çat, widget və s. --}}
    @if(!empty($seoConf?->footer_scripts))
        {!! $seoConf->footer_scripts !!}
    @endif
</body>
</html>
