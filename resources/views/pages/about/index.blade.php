@extends('layouts.app')

@section('title', __('About Us') . ' - ' . config('app.full_name'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-20">

    <!-- Hero Header -->
    <div class="relative bg-white border-b border-gray-200/80 overflow-hidden">
        <div class="absolute inset-0 bg-radial from-orange-50/70 via-transparent to-transparent opacity-70 pointer-events-none"></div>
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative">
            <div class="max-w-3xl mx-auto text-center space-y-4">
                <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-100 text-primary text-xs font-extrabold uppercase tracking-wider">
                    <i class="fas fa-sparkles text-[10px]"></i>
                    {{ __('About Jobing.az') }}
                </span>
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {{ __("Azerbaijan's Modern") }} <span class="text-primary">{{ __('Career') }}</span> {{ __('and Talent Ecosystem') }}
                </h1>
                <p class="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {{ __("Jobing.az is a digital career platform that connects the country's leading companies with talent across programming, design, marketing, management and other professions in the fastest and most transparent way.") }}
                </p>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 max-w-6xl space-y-12">

        <!-- Live Platform Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-xl shrink-0">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div>
                    <span class="text-xl sm:text-2xl font-black text-gray-900 block font-mono">{{ $stats['vacancies'] }}+</span>
                    <span class="text-xs font-semibold text-gray-500 block">{{ __('Active Vacancy') }}</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                    <i class="fas fa-building"></i>
                </div>
                <div>
                    <span class="text-xl sm:text-2xl font-black text-gray-900 block font-mono">{{ $stats['companies'] }}+</span>
                    <span class="text-xs font-semibold text-gray-500 block">{{ __('Company & Partner') }}</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                    <i class="fas fa-file-invoice"></i>
                </div>
                <div>
                    <span class="text-xl sm:text-2xl font-black text-gray-900 block font-mono">{{ $stats['resumes'] }}+</span>
                    <span class="text-xs font-semibold text-gray-500 block">{{ __('Professional CV / Resume') }}</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div>
                    <span class="text-xl sm:text-2xl font-black text-gray-900 block font-mono">{{ $stats['jobSeekers'] }}+</span>
                    <span class="text-xs font-semibold text-gray-500 block">{{ __('Job Seeking Listing') }}</span>
                </div>
            </div>
        </div>

        <!-- Mission & Vision Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 shadow-2xs space-y-3">
                <div class="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-base font-bold">
                    <i class="fas fa-bullseye"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">{{ __('Our Mission') }}</h3>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {{ __('To free the job search process from complex bureaucracy and ensure every candidate finds the right opportunity for their skills, while giving companies direct, fastest access to the talent they need.') }}
                </p>
            </div>

            <div class="bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 shadow-2xs space-y-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold">
                    <i class="fas fa-eye"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">{{ __('Our Vision') }}</h3>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {{ __('To become the most modern, technologically advanced and user-centred job portal in Azerbaijan and the region; to be a trusted guide in both the local labour market and international remote work opportunities.') }}
                </p>
            </div>
        </div>

        <!-- Why Jobing.az (Core Features) -->
        <div class="space-y-6">
            <div class="text-center max-w-xl mx-auto space-y-2">
                <h2 class="text-2xl font-bold text-gray-900">{{ __('Why Jobing.az?') }}</h2>
                <p class="text-xs sm:text-sm text-gray-500">{{ __('The key principles that set our platform apart from others.') }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:border-primary/40 transition space-y-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-base font-bold">
                        <i class="fas fa-filter"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ __('Smart Filtering') }}</h4>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        {{ __('Instant search by categories, work schedule, work mode (Office/Hybrid/Remote) and required skills.') }}
                    </p>
                </div>

                <div class="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:border-primary/40 transition space-y-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base font-bold">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ __('Transparent Salary Display') }}</h4>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        {{ __('Salaries are clearly shown on listings, so you save time and apply to vacancies that match your expectations.') }}
                    </p>
                </div>

                <div class="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:border-primary/40 transition space-y-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold">
                        <i class="fas fa-paper-plane"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ __('Direct & Easy Application') }}</h4>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        {{ __('One-click application without registration or via your profile, delivered directly to the company email.') }}
                    </p>
                </div>

                <div class="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:border-primary/40 transition space-y-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base font-bold">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ __('Verified Companies') }}</h4>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        {{ __('To prevent spam and unserious listings, all listings are carefully reviewed by the admin team.') }}
                    </p>
                </div>
            </div>
        </div>

        <!-- For Job Seekers vs For Employers -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Job Seekers -->
            <div class="bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-base font-bold">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 text-base">{{ __('For Candidates') }}</h3>
                        <p class="text-xs text-gray-400">{{ __('Take your career a step forward') }}</p>
                    </div>
                </div>

                <ul class="space-y-3 text-xs sm:text-sm text-gray-600">
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-emerald-500 mt-1 shrink-0"></i>
                        <span>{{ __('A broad vacancy base and technology-focused categories') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-emerald-500 mt-1 shrink-0"></i>
                        <span>{{ __('Post a personal "I am looking for a job" ad so companies can find you') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-emerald-500 mt-1 shrink-0"></i>
                        <span>{{ __('Create an online CV and print it in PDF format') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-emerald-500 mt-1 shrink-0"></i>
                        <span>{{ __('Save vacancies you like to your favorites') }}</span>
                    </li>
                </ul>

                <div class="pt-2">
                    <a href="{{ route('jobs.index') }}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition shadow-xs">
                        <i class="fas fa-search"></i>
                        <span>{{ __('Discover Vacancies') }}</span>
                    </a>
                </div>
            </div>

            <!-- Employers -->
            <div class="bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold">
                        <i class="fas fa-city"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 text-base">{{ __('For Companies & Employers') }}</h3>
                        <p class="text-xs text-gray-400">{{ __('Find the strongest candidates for your team') }}</p>
                    </div>
                </div>

                <ul class="space-y-3 text-xs sm:text-sm text-gray-600">
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-blue-500 mt-1 shrink-0"></i>
                        <span>{{ __('Post a vacancy easily in just a few minutes') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-blue-500 mt-1 shrink-0"></i>
                        <span>{{ __('Access to a rich CV database and listings of job-seeking professionals') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-blue-500 mt-1 shrink-0"></i>
                        <span>{{ __('Increase brand recognition by creating an official company profile') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-blue-500 mt-1 shrink-0"></i>
                        <span>{{ __('Track incoming applications and notifications from a single panel') }}</span>
                    </li>
                </ul>

                <div class="pt-2">
                    <a href="{{ route('jobs.create') }}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs">
                        <i class="fas fa-plus"></i>
                        <span>{{ __('Post a Listing') }}</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- CTA Card -->
        <div class="rounded-3xl bg-linear-to-r from-orange-500 to-amber-600 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="space-y-2 text-center md:text-left">
                <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight">{{ __('Reach Your Career Goal with Us') }}</h3>
                <p class="text-white/90 text-xs sm:text-sm max-w-xl">
                    {{ __('Whether you are looking for a new job or bringing a new professional to your team - Jobing.az is always by your side.') }}
                </p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
                <a href="{{ route('contact.index') }}" class="px-6 py-3 rounded-xl bg-white text-gray-900 text-xs font-extrabold hover:bg-gray-50 transition shadow-md">
                    {{ __('Contact Us') }}
                </a>
            </div>
        </div>

    </div>
</div>
@endsection
