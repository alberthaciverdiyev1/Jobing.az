@extends('layouts.app')

@section('title', __('Companies') . ' - ' . config('app.full_name'))
@section('meta_description', __('Discover leading companies registered on the platform and apply to their latest vacancies.'))

@section('content')
<script>
window.__COMPANIES_CONFIG__ = {
    initialQuery: @json(request('q', '')),
    initialSort: @json(request('sort', 'latest')),
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

        <!-- List Header: Count + Sorting -->
        <div class="flex flex-row justify-between items-center gap-2 sm:gap-3 mb-5 pb-3 border-b border-gray-200">
            <p class="text-xs sm:text-sm text-gray-500 leading-tight">
                <span class="font-semibold text-primary" x-text="totalCount">{{ $companies->total() }}</span> {{ __('companies found') }}
            </p>

            <select x-model="sort"
                    @change="applyFilters()"
                    class="w-[190px] sm:w-auto shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs text-gray-700 shadow-2xs cursor-pointer focus:border-primary focus:outline-hidden">
                <option value="latest">{{ __('By date (newest)') }}</option>
                <option value="active_jobs">{{ __('Companies with active vacancies') }}</option>
                <option value="verified_only">{{ __('Verified companies only') }}</option>
                <option value="popular">{{ __('With the most vacancies') }}</option>
                <option value="alphabetical">{{ __('Alphabetical order (A-Z)') }}</option>
            </select>
        </div>

        <!-- Companies Container -->
        <div id="companies-container" class="relative min-h-[300px]" :class="isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-150' : ''">
            @include('pages.companies.partials.company-list', ['companies' => $companies])
        </div>

    </div>
</div>
@endsection
