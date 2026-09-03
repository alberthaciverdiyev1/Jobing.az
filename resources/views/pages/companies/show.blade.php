@extends('layouts.app')

@section('title', $company->name . ' - ' . __('Şirkət Profili'))
@section('meta_description', strip_tags(Str::limit($company->about ?: __('Şirkət haqqında məlumat və aktiv vakansiyalar.'), 150)))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">

    <!-- Top Cover Banner (Only if banner exists) -->
    @if($company->banner)
    <div class="w-full relative bg-slate-900 overflow-hidden">
        <div class="h-44 sm:h-56 md:h-64 w-full">
            <img src="{{ asset('storage/' . $company->banner) }}" alt="{{ $company->name }}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/20"></div>
        </div>
    </div>
    @endif

    <!-- Company Header Bar -->
    <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Profile Header Info -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 {{ $company->banner ? '-mt-12 sm:-mt-14 relative z-10' : '' }}">

                <!-- Left: Logo + Details -->
                <div class="flex items-start sm:items-center gap-4 sm:gap-5">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 {{ $company->banner ? 'border-4 border-white shadow-md' : 'border border-gray-200 shadow-2xs' }} flex items-center justify-center font-bold text-white text-2xl sm:text-3xl shrink-0 overflow-hidden bg-white">
                        @if($company->logo)
                        <img src="{{ asset('storage/' . $company->logo) }}" alt="{{ $company->name }}" class="w-full h-full object-cover">
                        @else
                        <span class="w-full h-full bg-slate-900 text-white flex items-center justify-center font-bold">
                            {{ mb_substr($company->name, 0, 1) }}
                        </span>
                        @endif
                    </div>

                    <div class="space-y-1">
                        <div class="flex items-center gap-2.5 flex-wrap">
                            <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{{ $company->name }}</h1>
                            @if($company->is_verified)
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                                <i class="fas fa-check-circle text-sky-500 text-[11px]"></i>
                                <span>{{ __('Təsdiqlənmiş') }}</span>
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

                <!-- Right: Active Vacancies Counter Pill -->
                <div class="shrink-0 self-start md:self-center">
                    <div class="px-5 py-2.5 rounded-xl bg-orange-50/80 border border-orange-100 text-center min-w-[120px] shadow-2xs">
                        <span class="text-xl sm:text-2xl font-black text-primary font-mono block leading-tight">{{ $company->vacancies->count() }}</span>
                        <span class="text-[11px] font-bold text-orange-950 uppercase tracking-wider block mt-0.5">{{ __('Aktiv Vakansiya') }}</span>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <!-- Content Grid -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Left 2 cols: About FIRST, then Open Vacancies -->
            <div class="lg:col-span-2 space-y-8">

                <!-- 1. Şirkət Haqqında (About) -->
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-3">
                    <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
                        <span>{{ __('Şirkət Haqqında') }}</span>
                    </h2>
                    <div class="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {{ $company->about ?: __('Bu şirkət haqqında ətraflı məlumat tezliklə əlavə olunacaq.') }}
                    </div>
                </div>

                <!-- 2. Şirkətin Açık Vakansiyaları (Open Vacancies) -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between pb-2 border-b border-gray-200">
                        <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pl-5">
                            <span>{{ __('Aktiv Vakansiyalar') }}</span>
                            <span class="text-xs font-bold text-primary font-mono lowercase">({{ $company->vacancies->count() }})</span>
                        </h2>
                    </div>

                    @if($company->vacancies->count() > 0)
                    <div class="space-y-3">
                        @foreach($company->vacancies as $job)
                        <x-job-card :job="$job" />
                        @endforeach
                    </div>
                    @else
                    <div class="p-12 text-center bg-white rounded-xl border border-gray-200 text-gray-500 text-xs shadow-2xs">
                        <div class="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center mx-auto mb-3 border border-orange-100">
                            <i class="fas fa-briefcase text-base"></i>
                        </div>
                        <p class="font-bold text-gray-800 text-sm mb-1">{{ __('Hal-hazırda aktiv vakansiya yoxdur') }}</p>
                        <p class="text-gray-500 max-w-sm mx-auto">{{ __('Bu şirkətə aid yeni vakansiyalar yerləşdirildikdə burada görünəcək.') }}</p>
                    </div>
                    @endif
                </div>

            </div>

            <!-- Right: Contact Info Sidebar -->
            <div class="space-y-6">
                <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4 sticky top-24">
                    <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
                        <i class="fas fa-address-card text-primary text-xs"></i>
                        <span>{{ __('Əlaqə Məlumatları') }}</span>
                    </h3>

                    <div class="space-y-3.5 text-xs">
                        @if($company->email)
                        <div class="flex items-start gap-3">
                            <i class="far fa-envelope text-gray-400 text-xs mt-0.5"></i>
                            <div class="min-w-0 flex-1">
                                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{{ __('E-poçt') }}</span>
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
                                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{{ __('Telefon') }}</span>
                                <a href="tel:{{ $company->phone }}" class="text-gray-800 hover:text-primary font-medium block transition">
                                    {{ $company->phone }}
                                </a>
                            </div>
                        </div>
                        @endif

                        @if($company->location)
                        <div class="flex items-start gap-3">
                            <i class="fas fa-map-marker-alt text-gray-400 text-xs mt-0.5"></i>
                            <div class="min-w-0 flex-1">
                                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{{ __('Ünvan') }}</span>
                                <span class="text-gray-800 font-medium block">
                                    {{ $company->location }}
                                </span>
                            </div>
                        </div>
                        @endif

                        @if($company->website)
                        <div class="flex items-start gap-3">
                            <i class="fas fa-globe text-gray-400 text-xs mt-0.5"></i>
                            <div class="min-w-0 flex-1">
                                <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{{ __('Rəsmi Vebsayt') }}</span>
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
