@extends('layouts.app')

@section('title', __('Companies') . ' - ' . config('app.full_name'))
@section('meta_description', __('Discover leading companies registered on the platform and apply to their latest vacancies.'))

@section('content')
<script>
window.__COMPANIES_CONFIG__ = {
    initialQuery: @json(request('q', '')),
    initialSort: @json(request('sort', 'latest')),
    initialVerified: @json(request('verified', '')),
    initialHasJobs: @json(request('has_jobs', '')),
    initialLocation: @json(request('location', '')),
    initialTotal: {{ (int) $companies->total() }},
};
</script>

<div class="bg-gray-50 min-h-screen pb-16">

    <!-- Main Content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="companiesManager()">

        <!-- List Header (Title + Count + Search + Sorting) -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <div>
                <h2 class="text-lg md:text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                    <span>{{ __('Companies') }}</span>
                </h2>
                <p class="text-xs text-gray-500 mt-0.5">
                    <span class="font-bold text-primary" x-text="totalCount">{{ $companies->total() }}</span> {{ __('companies found') }}
                </p>
            </div>

            <!-- Right Controls: Search Input + Sorting -->
            <div class="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 text-xs">
                <!-- Search Input -->
                <div class="relative w-full sm:w-60 md:w-64">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                    <input type="text"
                           x-model="q"
                           @input.debounce.400ms="applyFilters()"
                           @keydown.enter.prevent="applyFilters()"
                           placeholder="{{ __('Search company...') }}"
                           class="w-full pl-8 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                    <button type="button"
                            x-show="q"
                            x-cloak
                            @click="q = ''; applyFilters()"
                            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Sorting Select -->
                <div class="flex items-center gap-2 shrink-0">
                    <select x-model="sort"
                            @change="applyFilters()"
                            class="w-full sm:w-auto text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                        <option value="latest">{{ __('By date (newest)') }}</option>
                        <option value="popular">{{ __('With the most vacancies') }}</option>
                        <option value="verified">{{ __('Verified first') }}</option>
                        <option value="alphabetical">{{ __('Alphabetical order (A-Z)') }}</option>
                    </select>
                </div>

                <button type="button"
                        x-show="hasActiveFilters"
                        x-cloak
                        @click="resetAllFilters()"
                        class="text-xs text-primary hover:underline font-semibold flex items-center gap-1 shrink-0 self-center sm:self-auto cursor-pointer"
                        title="{{ __('Reset all filters') }}">
                    <i class="fas fa-sync-alt text-[10px]"></i>
                    <span class="sm:hidden">{{ __('Reset') }}</span>
                </button>
            </div>
        </div>

        <!-- Companies Container -->
        <div id="companies-container" class="relative min-h-[300px]" :class="isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-150' : ''">
            @include('pages.companies.partials.company-list', ['companies' => $companies])
        </div>

    </div>
</div>
@endsection
