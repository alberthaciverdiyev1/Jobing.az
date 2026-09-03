@extends('layouts.app')

@section('title', config('app.full_name') . ' - ' . __('Uğurlu karyera yolu buradan başlayır'))

@section('content')
<!-- Modern Hero Section (Light Mode, Pill Search, No Background Shapes) -->
<section class="relative bg-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <!-- Headline -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 animate-fade-in-up mx-auto">
            {{ __('Uğurlu karyera yolu buradan başlayır') }}
        </h1>
        
        <!-- Subtext / Stats -->
        <p class="text-base md:text-lg text-gray-600 mb-10 animate-fade-in-up delay-100 mx-auto">
            <span class="inline-block border-b border-gray-300 pb-1">
                7 gün — <span class="text-primary font-bold">{{ $stats['recent_7_days'] }}</span> {{ __('yeni vakansiya') }}
            </span>
        </p>

        <!-- Pill-shaped Search Bar (Alpine.js) -->
        <form action="{{ route('jobs.index') }}" method="GET" 
              class="bg-white p-1.5 md:p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(251,146,60,0.15)] border border-gray-100 max-w-3xl mx-auto flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 animate-fade-in-up delay-200">
            <!-- Search Icon & Input -->
            <div class="flex-1 flex items-center pl-4 pr-2 py-2 group">
                <i class="fas fa-search text-gray-400 mr-3 group-focus-within:text-primary transition-colors"></i>
                <input type="text" name="q" placeholder="{{ __('Peşə, vəzifə və ya şirkət') }}..." 
                       class="w-full bg-transparent border-none focus:outline-hidden text-gray-700 placeholder-gray-400 text-sm md:text-base">
            </div>
            
            <!-- Filter link -->
            <a href="{{ route('jobs.index') }}" class="hidden sm:flex items-center justify-center p-3 text-gray-400 hover:text-primary transition-colors border-l border-gray-100" title="{{ __('Genişləndirilmiş axtarış') }}">
                <i class="fas fa-sliders-h text-lg"></i>
            </a>

            <!-- Action Button -->
            <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-orange-500/30 flex items-center justify-center whitespace-nowrap cursor-pointer">
                {{ __('İş tap') }}
            </button>
        </form>

        <!-- Category Tags (Hidden on mobile) -->
        <div class="mt-8 hidden sm:flex flex-wrap justify-center items-center gap-2 md:gap-3 max-w-4xl mx-auto animate-fade-in-up delay-300">
            @foreach($allCategories->take(8) as $cat)
            <a href="{{ route('jobs.index', ['category' => $cat->slug]) }}" 
               class="px-4 py-2 bg-white/80 backdrop-blur-xs border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-2xs">
                {{ $cat->name }}
            </a>
            @endforeach
            <a href="{{ route('jobs.index') }}" 
               class="px-4 py-2 bg-white/80 backdrop-blur-xs border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-2xs">
                {{ __('Bütün kateqoriyalar') }}
            </a>
        </div>
    </div>
</section>

<!-- Popular Categories Section (Compact & Sleek) -->
<section class="py-8 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-4 animate-fade-in-up">
            <div>
                <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-0.5">{{ __('Populyar Kateqoriyalar') }}</h2>
                <p class="text-[11px] md:text-xs text-gray-500">{{ __('Sizə uyğun sahəni seçin və fürsətləri kəşf edin.') }}</p>
            </div>
            <a href="{{ route('jobs.index') }}" class="hidden sm:flex text-primary hover:text-primary-dark font-medium items-center gap-1 group text-xs">
                <span>{{ __('Hamısına bax') }}</span>
                <i class="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
            </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in-up delay-100">
            @foreach($categories as $category)
            <a href="{{ route('jobs.index', ['category' => $category->slug]) }}" 
               class="group border border-gray-100 p-3.5 sm:p-4 rounded-xl hover:border-orange-200 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 bg-white flex flex-col items-center text-center">
                <div class="w-9 h-9 sm:w-10 sm:h-10 bg-orange-50 text-primary rounded-full flex items-center justify-center text-base mb-2 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <i class="fas {{ $category->icon ?: 'fa-briefcase' }}"></i>
                </div>
                <h3 class="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5 group-hover:text-primary transition-colors leading-tight line-clamp-1">
                    {{ $category->name }}
                </h3>
                <span class="text-[11px] text-gray-400 mt-auto">{{ $category->vacancies_count }} {{ __('Vakansiya') }}</span>
            </a>
            @endforeach
        </div>

        <div class="mt-4 text-center sm:hidden">
            <a href="{{ route('jobs.index') }}" class="text-primary hover:text-primary-dark text-xs font-medium inline-flex items-center gap-1">
                {{ __('Bütün kateqoriyalar') }} <i class="fas fa-arrow-right text-[10px]"></i>
            </a>
        </div>
    </div>
</section>

<!-- Latest Vacancies Section -->
<section class="py-16 bg-gray-50 border-t border-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-10 animate-fade-in-up">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{{ __('Ən Son Vakansiyalar') }}</h2>
            <p class="text-sm text-gray-500">{{ __('Platformaya əlavə edilən ən yeni iş imkanları.') }}</p>
        </div>

        <!-- Job Cards Grid -->
        <!-- Job Cards Grid (Using same card component as list page) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up delay-200">
            @foreach($latestJobs as $job)
            <x-job-card :job="$job" />
            @endforeach
        </div>

        <!-- All Jobs CTA Button -->
        <div class="mt-10 text-center">
            <a href="{{ route('jobs.index') }}" 
               class="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-primary font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-2xs hover:shadow-sm text-sm">
                <span>{{ __('Bütün vakansiyalara bax') }} ({{ $stats['jobs'] }}+)</span>
                <i class="fas fa-arrow-right text-xs"></i>
            </a>
        </div>
    </div>
</section>

<!-- Employer Call to Action Section (Dark Banner with Stats) -->
<section class="py-20 bg-dark relative overflow-hidden text-white">
    <!-- Background elements -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
        <svg class="absolute right-0 top-0 h-full w-full object-cover transform translate-x-1/2" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="currentColor" points="0,100 100,0 100,100"/>
        </svg>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div class="lg:w-1/2 text-center lg:text-left">
                <h2 class="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    {{ __('Şirkətiniz üçün') }} <span class="text-primary">{{ __('ən yaxşı kadrları') }}</span> {{ __('tapın') }}
                </h2>
                <p class="text-gray-300 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                    {{ __('Minlərlə aktiv istifadəçisi olan platformamızda elanınızı yerləşdirin və komandanızı peşəkarlarla gücləndirin. İndi qeydiyyatdan keçin və ilk elanınızı pulsuz yerləşdirin.') }}
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a href="{{ route('jobs.create') }}" 
                       class="bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-xl transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 text-sm">
                        <i class="fas fa-building text-xs"></i> 
                        <span>{{ __('İşəgötürən kimi qoşul') }}</span>
                    </a>
                    <a href="{{ config('site.panels.admin') }}" target="_blank" 
                       class="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold py-3.5 px-8 rounded-xl transition-colors backdrop-blur-xs flex items-center justify-center gap-2 text-sm">
                        <i class="fas fa-shield-alt text-xs"></i>
                        <span>{{ __('Admin Paneli') }}</span>
                    </a>
                </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
                <div class="grid grid-cols-2 gap-4 sm:gap-6">
                    <div class="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center hover:bg-white/20 transition-colors cursor-default">
                        <div class="text-3xl sm:text-4xl font-bold text-white mb-2 font-mono">{{ $stats['jobs'] }}+</div>
                        <div class="text-gray-300 font-medium text-xs sm:text-sm">{{ __('Aktiv Vakansiya') }}</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center hover:bg-white/20 transition-colors cursor-default">
                        <div class="text-3xl sm:text-4xl font-bold text-white mb-2 font-mono">{{ $stats['applications'] }}+</div>
                        <div class="text-gray-300 font-medium text-xs sm:text-sm">{{ __('Ümumi Başvuru') }}</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center hover:bg-white/20 transition-colors cursor-default">
                        <div class="text-3xl sm:text-4xl font-bold text-white mb-2 font-mono">{{ $stats['verified_companies'] }}+</div>
                        <div class="text-gray-300 font-medium text-xs sm:text-sm">{{ __('Təsdiqlənmiş Şirkət') }}</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center hover:bg-white/20 transition-colors cursor-default">
                        <div class="text-3xl sm:text-4xl font-bold text-white mb-2 font-mono">{{ $stats['recent_7_days'] }}</div>
                        <div class="text-gray-300 font-medium text-xs sm:text-sm">{{ __('yeni vakansiya') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Trusted By Companies Section (Infinite Marquee) -->
<section class="py-12 bg-white border-b border-gray-100 overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {{ __('Bizə güvənən lider şirkətlər') }}
        </p>
    </div>

    <div class="relative w-full overflow-hidden">
        <!-- Left & Right Gradient Shadows for seamless fade -->
        <div class="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 bg-linear-to-r from-white to-transparent z-10"></div>
        <div class="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 bg-linear-to-l from-white to-transparent z-10"></div>

        <!-- Animated Scrolling Row (driven by backend companies, duplicated for seamless loop) -->
        @if($topCompanies->isNotEmpty())
        <div class="animate-marquee gap-12 sm:gap-16 items-center py-2 select-none opacity-65 hover:opacity-100 transition-opacity">
            <!-- Set 1 -->
            <div class="flex items-center gap-12 sm:gap-16 shrink-0 text-gray-700">
                @foreach($topCompanies as $company)
                <a href="{{ route('companies.show', $company->slug) }}" class="flex items-center gap-2.5 font-bold text-xl tracking-tight hover:text-primary transition-colors">
                    @if($company->logo)
                    <img src="{{ asset('storage/' . $company->logo) }}" alt="{{ $company->name }}" class="w-8 h-8 rounded object-cover">
                    @else
                    <span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">{{ mb_substr($company->name, 0, 1) }}</span>
                    @endif
                    {{ $company->name }}
                </a>
                @endforeach
            </div>

            <!-- Set 2 (Duplicate for Seamless Loop) -->
            <div class="flex items-center gap-12 sm:gap-16 shrink-0 text-gray-700" aria-hidden="true">
                @foreach($topCompanies as $company)
                <span class="flex items-center gap-2.5 font-bold text-xl tracking-tight">
                    @if($company->logo)
                    <img src="{{ asset('storage/' . $company->logo) }}" alt="" class="w-8 h-8 rounded object-cover">
                    @else
                    <span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">{{ mb_substr($company->name, 0, 1) }}</span>
                    @endif
                    {{ $company->name }}
                </span>
                @endforeach
            </div>
        </div>
        @endif
    </div>
</section>
@endsection
