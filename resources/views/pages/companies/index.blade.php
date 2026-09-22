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
    filterErrorMessage: @json(__('Filters could not be loaded. Please try again.')),
};
</script>

<div class="bg-gray-50 min-h-screen pb-16" x-data="companiesManager()">
    <div x-show="errorMessage" x-cloak class="container mx-auto px-4 pt-3">
        <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" x-text="errorMessage"></div>
    </div>

    <!-- Hero -->
    <x-list-hero :title="__('Companies')" :placeholder="__('Search company...')" />

    <!-- Main Content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8">

        <div class="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
            <label class="space-y-1.5 text-xs font-medium text-gray-700">
                <span>{{ __('City') }}</span>
                <select x-model="location" @change="applyFilters()"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs focus:border-primary focus:bg-white focus:outline-hidden">
                    <option value="">{{ __('All cities') }}</option>
                    @foreach($cities as $city)
                    <option value="{{ $city->slug }}">{{ $city->name }}</option>
                    @endforeach
                </select>
            </label>

            <label class="flex items-center gap-2 self-end rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 cursor-pointer"
                   :class="verified ? 'border-orange-200 bg-orange-50 text-primary font-semibold' : 'bg-gray-50'">
                <input type="checkbox" x-model="verified" true-value="1" false-value="" @change="applyFilters()"
                       class="rounded border-gray-300 text-primary focus:ring-primary">
                <span>{{ __('Verified companies only') }}</span>
            </label>

            <label class="flex items-center gap-2 self-end rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 cursor-pointer"
                   :class="hasJobs ? 'border-orange-200 bg-orange-50 text-primary font-semibold' : 'bg-gray-50'">
                <input type="checkbox" x-model="hasJobs" true-value="1" false-value="" @change="applyFilters()"
                       class="rounded border-gray-300 text-primary focus:ring-primary">
                <span>{{ __('Companies with active vacancies') }}</span>
            </label>

            <label class="space-y-1.5 text-xs font-medium text-gray-700">
                <span>{{ __('Sorting') }}</span>
                <select x-model="sort"
                        @change="applyFilters()"
                        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 shadow-2xs cursor-pointer focus:border-primary focus:bg-white focus:outline-hidden">
                    <option value="latest">{{ __('By date (newest)') }}</option>
                    <option value="popular">{{ __('With the most vacancies') }}</option>
                    <option value="verified">{{ __('Verified first') }}</option>
                    <option value="alphabetical">{{ __('Alphabetical order (A-Z)') }}</option>
                </select>
            </label>
        </div>

        <!-- List Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b border-gray-200">
            <p class="text-sm text-gray-500">
                <span class="font-semibold text-primary" x-text="totalCount">{{ $companies->total() }}</span> {{ __('companies found') }}
            </p>

            <div class="flex items-center text-xs">
                <button type="button"
                        x-show="hasActiveFilters"
                        x-cloak
                        @click="resetAllFilters()"
                        class="text-xs text-primary hover:underline font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                        title="{{ __('Reset all filters') }}">
                    <i class="fas fa-sync-alt text-[11px]"></i>
                    <span>{{ __('Reset') }}</span>
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
