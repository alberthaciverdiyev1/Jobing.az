@extends('layouts.app')

@section('title', __('Şirkətlər') . ' - ' . config('app.full_name'))
@section('meta_description', __('Platformada qeydiyyatdan keçmiş aparıcı şirkətləri kəşf edin və onların ən son vakansiyalarına müraciət edin.'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">

    <!-- Main Content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- List Header (Title + Count + Search + Sorting) -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <div>
                <h2 class="text-lg md:text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                    <span>{{ __('Şirkətlər') }}</span>
                </h2>
                <p class="text-xs text-gray-500 mt-0.5">
                    <span class="font-bold text-primary">{{ $companies->total() }}</span> {{ __('şirkət tapıldı') }}
                </p>
            </div>

            <!-- Right Controls: Search Input + Sorting -->
            <form action="{{ route('companies.index') }}" method="GET" class="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 text-xs">
                @if(request('verified'))
                <input type="hidden" name="verified" value="{{ request('verified') }}">
                @endif
                @if(request('has_jobs'))
                <input type="hidden" name="has_jobs" value="{{ request('has_jobs') }}">
                @endif
                @if(request('location'))
                <input type="hidden" name="location" value="{{ request('location') }}">
                @endif

                <!-- Search Input -->
                <div class="relative w-full sm:w-60 md:w-64">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                    <input type="text"
                           name="q"
                           value="{{ request('q') }}"
                           placeholder="{{ __('Şirkət axtar...') }}"
                           class="w-full pl-8 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                    @if(request('q'))
                    <a href="{{ route('companies.index', array_merge(request()->except('q'))) }}"
                       class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                        <i class="fas fa-times"></i>
                    </a>
                    @endif
                </div>

                <!-- Sorting Select -->
                <div class="flex items-center gap-2 shrink-0">
                    <select name="sort"
                            onchange="this.form.submit()"
                            class="w-full sm:w-auto text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                        <option value="latest" {{ request('sort', 'latest') === 'latest' ? 'selected' : '' }}>{{ __('Tarixə görə (yeni)') }}</option>
                        <option value="popular" {{ request('sort') === 'popular' ? 'selected' : '' }}>{{ __('Ən çox vakansiyası olan') }}</option>
                        <option value="verified" {{ request('sort') === 'verified' ? 'selected' : '' }}>{{ __('Təsdiqlənmişlər öncə') }}</option>
                        <option value="alphabetical" {{ request('sort') === 'alphabetical' ? 'selected' : '' }}>{{ __('Əlifba sırası (A-Z)') }}</option>
                    </select>
                </div>

                @if(request('q') || (request('sort') && request('sort') !== 'latest') || request('verified') || request('has_jobs') || request('location'))
                <a href="{{ route('companies.index') }}" class="text-xs text-primary hover:underline font-semibold flex items-center gap-1 shrink-0 self-center sm:self-auto" title="{{ __('Bütün filtrləri sıfırla') }}">
                    <i class="fas fa-sync-alt text-[10px]"></i>
                    <span class="sm:hidden">{{ __('Sıfırla') }}</span>
                </a>
                @endif
            </form>
        </div>

        @if($companies->count() > 0)
        <!-- Companies Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @foreach($companies as $company)
            <x-company-card :company="$company" />
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="mt-10 pagination-wrapper">
            {{ $companies->links() }}
        </div>

        @else
        <!-- Empty State -->
        <x-empty-state icon="fa-building"
                       :title="__('Axtarışa uyğun şirkət tapılmadı')"
                       :description="__('Axtarış sözünü dəyişərək və ya tətbiq etdiyiniz filtrləri sıfırlayaraq yenidən cəhd edə bilərsiniz.')">
            @slot('actions')
            <a href="{{ route('companies.index') }}"
               class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
                <i class="fas fa-sync-alt text-xs"></i>
                <span>{{ __('Bütün filtrləri sıfırla') }}</span>
            </a>
            @endslot
        </x-empty-state>
        @endif

    </div>
</div>
@endsection
