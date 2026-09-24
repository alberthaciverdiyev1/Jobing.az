@extends('layouts.app')

@section('title', $company->name . ' - ' . __('Company Profile'))
@section('meta_description', strip_tags(Str::limit($company->about ?: __('Information about the company and its active vacancies.'), 150)))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">

    @if($company->banner)
    <div class="w-full relative bg-slate-900 overflow-hidden">
        <div class="h-44 sm:h-56 md:h-64 w-full">
            <img src="{{ asset('storage/' . $company->banner) }}" alt="{{ $company->name }}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/20"></div>
        </div>
    </div>
    @endif

    <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">

            <div class="flex items-center justify-between gap-3 sm:gap-6 py-4 sm:py-6 {{ $company->banner ? '-mt-12 sm:-mt-14 relative z-10' : '' }}">

                <div class="flex items-center gap-3 sm:gap-5 min-w-0">
                    <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-slate-900 {{ $company->banner ? 'border-4 border-white shadow-md' : 'border border-gray-200 shadow-2xs' }} flex items-center justify-center font-semibold text-white text-xl sm:text-3xl shrink-0 overflow-hidden bg-white">
                        @if($company->logo)
                        <img src="{{ asset('storage/' . $company->logo) }}" alt="{{ $company->name }}" class="w-full h-full object-cover">
                        @else
                        <span class="w-full h-full bg-slate-900 text-white flex items-center justify-center font-semibold">
                            {{ mb_substr($company->name, 0, 1) }}
                        </span>
                        @endif
                    </div>

                    <div class="space-y-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight truncate">{{ $company->name }}</h2>
                            @if($company->is_verified)
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                                <i class="fas fa-check-circle text-sky-500 text-[12px]"></i>
                                <span>{{ __('Verified') }}</span>
                            </span>
                            @endif
                        </div>

                        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 pt-0.5">
                            @if($company->city_name)
                            <span class="flex items-center gap-1">
                                <i class="fas fa-map-marker-alt text-gray-400 text-xs"></i>
                                <span>{{ $company->city_name }}</span>
                            </span>
                            @endif

                            @if($company->city_name && $company->website)
                            <span class="text-gray-300">•</span>
                            @endif

                            @if($company->website)
                            <a href="{{ $company->website }}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-primary hover:underline font-medium transition">
                                <i class="fas fa-globe text-xs"></i>
                                <span>{{ preg_replace('#^https?://(www\.)?#', '', $company->website) }}</span>
                            </a>
                            @endif
                        </div>
                    </div>
                </div>

                <div class="shrink-0">
                    <div class="px-2.5 sm:px-5 py-2 rounded-xl bg-orange-50/80 border border-orange-100 text-center min-w-[72px] sm:min-w-[120px] shadow-2xs">
                        <span class="text-lg sm:text-2xl font-semibold text-primary font-mono block leading-none">{{ $company->vacancies->count() }}</span>
                        <span class="text-[10px] sm:text-[12px] font-medium text-gray-700 block mt-1 whitespace-nowrap">{{ __('Active Vacancy') }}</span>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div class="lg:col-span-2 space-y-8">

                <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs space-y-3">
                    <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <span>{{ __('About Company') }}</span>
                    </h2>
                    <div class="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {{ $company->about ?: __('Detailed information about this company will be added soon.') }}
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between pb-2 border-b border-gray-200">
                        <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <span>{{ __('Active Vacancies') }}</span>
                            <span class="text-xs font-semibold text-primary font-mono lowercase">({{ $company->vacancies->count() }})</span>
                        </h2>
                    </div>

                    @if($company->vacancies->count() > 0)
                    <div class="space-y-3">
                        @foreach($company->vacancies as $job)
                        <x-job-card :job="$job" />
                        @endforeach
                    </div>
                    @else
                    <div class="p-8 sm:p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-500 text-xs shadow-2xs">
                        <div class="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center mx-auto mb-3 border border-orange-100">
                            <i class="fas fa-briefcase text-base"></i>
                        </div>
                        <p class="font-semibold text-gray-800 text-sm mb-1">{{ __('No active vacancies at the moment') }}</p>
                        <p class="text-gray-500 max-w-sm mx-auto">{{ __('New vacancies posted by this company will appear here.') }}</p>
                    </div>
                    @endif
                </div>

            </div>

            <div class="space-y-6">
                <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4 sticky top-24">
                    <h3 class="text-xs font-medium text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                        <i class="fas fa-address-card text-primary text-xs"></i>
                        <span>{{ __('Contact Information') }}</span>
                    </h3>

                    <div class="space-y-3.5 text-xs">
                        @if($company->email)
                        <div class="flex items-start gap-3">
                            <i class="far fa-envelope text-gray-400 text-xs mt-0.5"></i>
                            <div class="min-w-0 flex-1">
                                <span class="text-[11px] font-medium text-gray-400 block">{{ __('Email') }}</span>
                                <a href="mailto:{{ $company->email }}" class="text-gray-800 hover:text-primary font-medium truncate block transition">
                                    {{ $company->email }}
                                </a>
                            </div>
                        </div>
                        @endif

                        @if($company->phone)
                        <div class="flex items-start gap-3">
                            <i class="fas fa-phone text-gray-400 text-xs mt-0.5"></i>
                            <div class="min-w-0 flex-1">
                                <span class="text-[11px] font-medium text-gray-400 block">{{ __('Phone') }}</span>
                                <a href="tel:{{ $company->phone }}" class="text-gray-800 hover:text-primary font-medium block transition">
                                    {{ $company->phone }}
                                </a>
                            </div>
                        </div>
                        @endif

                        @if($company->city_name)
                        <div class="flex items-start gap-3">
                            <i class="fas fa-map-marker-alt text-gray-400 text-xs mt-0.5"></i>
                            <div class="min-w-0 flex-1">
                                <span class="text-[11px] font-medium text-gray-400 block">{{ __('Address') }}</span>
                                <span class="text-gray-800 font-medium block">
                                    {{ $company->city_name }}
                                </span>
                            </div>
                        </div>
                        @endif

                        @if($company->website)
                        <div class="flex items-start gap-3">
                            <i class="fas fa-globe text-gray-400 text-xs mt-0.5"></i>
                            <div class="min-w-0 flex-1">
                                <span class="text-[11px] font-medium text-gray-400 block">{{ __('Official Website') }}</span>
                                <a href="{{ $company->website }}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold truncate block transition">
                                    {{ preg_replace('#^https?://(www\.)?#', '', $company->website) }}
                                </a>
                            </div>
                        </div>
                        @endif
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection
