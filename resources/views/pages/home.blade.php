@extends('layouts.app')

@section('title', config('app.full_name') . ' - ' . __('A successful career path starts here'))

@section('content')
<!-- Hero Section (Editorial, left-aligned) -->
<section class="relative bg-white pt-14 pb-16 lg:pt-24 lg:pb-20 border-b border-gray-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">

            <!-- Headline -->
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                {{ __('A successful career path starts here') }}
            </h2>

            <!-- Subtext / Stats -->
            <p class="text-sm md:text-base text-gray-500 mb-8">
                <span class="font-semibold text-gray-900">{{ $stats['recent_7_days'] }}</span> {{ __('new vacancies') }}
            </p>

            <!-- Search Bar -->
            <form action="{{ route('jobs.index') }}" method="GET"
                  class="bg-white rounded-xl border border-gray-300 focus-within:border-gray-500 max-w-2xl flex items-center transition-colors">
                <!-- Search Icon & Input -->
                <div class="flex-1 flex items-center pl-4 pr-2 py-3.5 group">
                    <i class="fas fa-search text-gray-400 mr-3 group-focus-within:text-gray-900 transition-colors"></i>
                    <input type="text" name="q" placeholder="{{ __('Profession, role or company') }}..."
                           class="w-full bg-transparent border-none focus:outline-hidden text-gray-700 placeholder-gray-400 text-sm md:text-base">
                </div>

                <!-- Action Button -->
                <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-7 m-1.5 rounded-lg transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
                    {{ __('Search') }}
                </button>
            </form>

{{--        <!-- Category Tags (Hidden on mobile) -->--}}
{{--        <div class="mt-8 hidden sm:flex flex-wrap justify-center items-center gap-2 md:gap-3 max-w-4xl mx-auto">--}}
{{--            @foreach($allCategories as $cat)--}}
{{--            <a href="{{ route('jobs.index', ['category' => $cat->slug]) }}"--}}
{{--               class="px-4 py-2 bg-white/80 backdrop-blur-xs border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-2xs">--}}
{{--                {{ $cat->name }}--}}
{{--            </a>--}}
{{--            @endforeach--}}
{{--            <a href="{{ route('jobs.index') }}"--}}
{{--               class="px-4 py-2 bg-white/80 backdrop-blur-xs border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-2xs">--}}
{{--                {{ __('All categories') }}--}}
{{--            </a>--}}
{{--        </div>--}}
    </div>
</section>

<!-- Popular Categories Section (Compact & Sleek) -->
<section class="py-8 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-4">
            <div>
                <h2 class="text-lg md:text-xl font-semibold text-gray-900 mb-0.5">{{ __('Popular Categories') }}</h2>
            </div>
            <a href="{{ route('jobs.index') }}" class="hidden sm:flex text-primary hover:text-primary-dark font-medium items-center gap-1 group text-xs">
                <span>{{ __('View all') }}</span>
                <i class="fas fa-arrow-right text-[11px] transform group-hover:translate-x-1 transition-transform"></i>
            </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            @foreach($categories as $category)
            <a href="{{ route('jobs.index', ['category' => $category->slug]) }}"
               class="group border border-gray-100 p-3.5 sm:p-4 rounded-xl hover:border-orange-200 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 bg-white flex flex-col items-center text-center">
                <div class="w-9 h-9 sm:w-10 sm:h-10 bg-orange-50 text-primary rounded-full flex items-center justify-center text-base mb-2 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <i class="fas {{ $category->icon ?: 'fa-briefcase' }}"></i>
                </div>
                <h3 class="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5 group-hover:text-primary transition-colors leading-tight line-clamp-1">
                    {{ $category->name }}
                </h3>
                <span class="text-[12px] text-gray-400 mt-auto">{{ $category->vacancies_count }} {{ __('Vacancy') }}</span>
            </a>
            @endforeach
        </div>

        <div class="mt-4 text-center sm:hidden">
            <a href="{{ route('jobs.index') }}" class="text-primary hover:text-primary-dark text-xs font-medium inline-flex items-center gap-1">
                {{ __('All categories') }} <i class="fas fa-arrow-right text-[11px]"></i>
            </a>
        </div>
    </div>
</section>

<!-- Premium Vacancies Section (VIP Showcase) -->
@if(isset($featuredJobs) && $featuredJobs->count() > 0)
<section class="py-14">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight flex items-center gap-2.5">
                    <span>{{ __('Premium Vacancies') }}</span>
                </h2>
            </div>
            <a href="{{ route('jobs.index', ['sort' => 'featured']) }}"
               class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors self-start sm:self-auto group">
                <span>{{ __('All premium vacancies') }}</span>
                <i class="fas fa-arrow-right text-[11px] group-hover:translate-x-0.5 transition-transform"></i>
            </a>
        </div>

        <!-- Premium Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            @foreach($featuredJobs as $job)
            <x-job-card :job="$job" />
            @endforeach
        </div>
    </div>
</section>
@endif

<!-- Latest Vacancies Section -->
<section class="py-16 bg-gray-50 border-t border-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
                <h2 class="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">{{ __('Latest Vacancies') }}</h2>
            </div>
            <a href="{{ route('jobs.index') }}"
               class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors self-start sm:self-auto group">
                <span>{{ __('All listings') }} ({{ $stats['jobs'] }}+)</span>
                <i class="fas fa-arrow-right text-[11px] group-hover:translate-x-0.5 transition-transform"></i>
            </a>
        </div>

        <!-- Latest Job Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            @foreach($latestJobs as $job)
            <x-job-card :job="$job" />
            @endforeach
        </div>

        <!-- All Jobs CTA Button -->
        <div class="mt-10 text-center">
            <a href="{{ route('jobs.index') }}"
               class="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-primary font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-2xs hover:shadow-sm text-sm">
                <span>{{ __('View all vacancies') }} ({{ $stats['jobs'] }}+)</span>
                <i class="fas fa-arrow-right text-xs"></i>
            </a>
        </div>
    </div>
</section>

<!-- Employer CTA -->
<section class="py-20 bg-dark text-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
                <h2 class="text-3xl md:text-4xl font-semibold mb-6 leading-tight">
                    {{ __('For your company') }} <span class="text-primary">{{ __('the best talent') }}</span> {{ __('find') }}
                </h2>
                <p class="text-gray-400 text-base mb-8 max-w-xl leading-relaxed">
                    {{ __('Post your listing on our platform with thousands of active users and strengthen your team with professionals. Register now and post your first listing for free.') }}
                </p>
                <div class="flex flex-col sm:flex-row gap-3">
                    <a href="{{ route('jobs.create') }}"
                       class="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-7 rounded-md transition-colors inline-flex items-center justify-center text-sm">
                        <span>{{ __('Join as employer') }}</span>
                    </a>
                    <a href="{{ config('site.panels.admin') }}" target="_blank"
                       class="border border-white/25 hover:border-white/60 text-white font-semibold py-3 px-7 rounded-md transition-colors inline-flex items-center justify-center text-sm">
                        <span>{{ __('Admin Panel') }}</span>
                    </a>
                </div>
            </div>

            <dl class="grid grid-cols-2 gap-px bg-white/15 border border-white/15">
                <div class="bg-dark p-6">
                    <dd class="text-3xl font-semibold font-mono mb-1">{{ $stats['jobs'] }}+</dd>
                    <dt class="text-xs text-gray-400">{{ __('Active Vacancy') }}</dt>
                </div>
                <div class="bg-dark p-6">
                    <dd class="text-3xl font-semibold font-mono mb-1">{{ $stats['applications'] }}+</dd>
                    <dt class="text-xs text-gray-400">{{ __('General Application') }}</dt>
                </div>
                <div class="bg-dark p-6">
                    <dd class="text-3xl font-semibold font-mono mb-1">{{ $stats['verified_companies'] }}+</dd>
                    <dt class="text-xs text-gray-400">{{ __('Verified Companies') }}</dt>
                </div>
                <div class="bg-dark p-6">
                    <dd class="text-3xl font-semibold font-mono mb-1">{{ $stats['recent_7_days'] }}</dd>
                    <dt class="text-xs text-gray-400">{{ __('new vacancies') }}</dt>
                </div>
            </dl>
        </div>
    </div>
</section>

<!-- Companies -->
@if($topCompanies->isNotEmpty())
<section class="py-12 bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs text-gray-400 mb-6">{{ __('Leading companies that trust us') }}</p>
        <div class="flex flex-wrap items-center gap-x-10 gap-y-5">
            @foreach($topCompanies as $company)
            <a href="{{ route('companies.show', $company->slug) }}" class="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                @if($company->logo)
                <img src="{{ asset('storage/' . $company->logo) }}" alt="{{ $company->name }}" class="w-6 h-6 object-cover">
                @else
                <span class="w-6 h-6 bg-gray-900 text-white flex items-center justify-center text-[12px]">{{ mb_substr($company->name, 0, 1) }}</span>
                @endif
                {{ $company->name }}
            </a>
            @endforeach
        </div>
    </div>
</section>
@endif
@endsection
