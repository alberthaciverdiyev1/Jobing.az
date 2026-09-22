@extends('layouts.app')

@section('title', ($selectedCategory?->name ? $selectedCategory->name . ' | ' : '') . __('Vacancies') . ' - ' . config('app.full_name'))
@section('meta_description', $selectedCategory?->name
    ? __('Category') . ' ' . $selectedCategory->name . ' — ' . __('browse all vacancies in this category and apply.')
    : __('Instantly apply to open positions at leading technology companies in software, design, product, data and marketing.'))

@section('content')
<script>
window.__JOBS_CONFIG__ = {
    initialCategory: @json(
        request('subcategory')
            ? array_values((array) request('subcategory'))
            : (array_values((array) request('category', [])) ?: ($selectedCategory ? [$selectedCategory->slug] : []))
    ),
    initialQuery: @json(request('q', '')),
    initialMinSalary: @json(request('min_salary', '')),
    initialMaxSalary: @json(request('max_salary', '')),
    initialType: @json(array_values((array) request('type', []))),
    initialWorkplace: @json(array_values((array) request('workplace', []))),
    initialExperience: @json(array_values((array) request('experience', []))),
    initialCity: @json(array_values((array) request('city', []))),
    initialSkills: @json(array_values((array) request('skills', []))),
    initialSort: @json(request('sort', 'latest')),
    initialTotal: {{ (int) $jobs->total() }},
    activeParentCategory: @json($selectedCategory ? ($selectedCategory->parent_id ? $selectedCategory->parent->slug : $selectedCategory->slug) : ''),
    activeParentCategories: @json($selectedCategories->map(fn ($c) => $c->parent_id ? $c->parent->slug : $c->slug)->values()),
    categoryChildrenMap: @json($categories->mapWithKeys(fn ($c) => [$c->slug => $c->children->pluck('slug')->values()])),
    categoryParentMap: @json($categoryParentMap),
    parentCategorySlugs: @json($parentCategorySlugs),
    citySlugs: @json($citySlugs),
    initialCounts: {
        jobTypes: @json($jobTypes->pluck('vacancies_count', 'slug')),
        workplaceTypes: @json($workplaceTypes->pluck('vacancies_count', 'slug')),
        experienceLevels: @json($experienceLevels->pluck('vacancies_count', 'slug')),
        cities: @json($cities->pluck('vacancies_count', 'slug'))
    },
    initialCategoryCounts: @json($categoryCounts),
    categoryNameMap: @json($categories->pluck('name', 'slug')->union($categories->flatMap->children->pluck('name', 'slug'))),
    workplaceTypeNameMap: @json($workplaceTypes->pluck('name', 'slug')),
    experienceLevelNameMap: @json($experienceLevels->pluck('name', 'slug')),
    jobTypeNameMap: @json($jobTypes->pluck('name', 'slug')),
    cityNameMap: @json($cities->pluck('name', 'slug')),
    filterErrorMessage: @json(__('Filters could not be loaded. Please try again.'))
};
</script>

@php
    $heroIcons = [
        ['fa-briefcase', 6, 18, 54, -12],
        ['fa-user-tie', 88, 14, 52, 10],
        ['fa-laptop-code', 12, 62, 46, 8],
        ['fa-file-lines', 80, 68, 48, -8],
        ['fa-graduation-cap', 25, 15, 36, 14],
        ['fa-magnifying-glass', 72, 12, 38, -14],
        ['fa-chart-line', 86, 82, 44, 6],
        ['fa-comments', 4, 78, 40, -10],
    ];
@endphp

<div class="bg-gray-50 min-h-screen pb-16" x-data="jobsManager()" @click.outside="closeAllDropdowns()">
    <div x-show="errorMessage" x-cloak class="container mx-auto px-4 pt-3">
        <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" x-text="errorMessage"></div>
    </div>

    <!-- Hero & Main Filter Section -->
    <section class="relative z-30 bg-gradient-to-b from-orange-50/70 via-orange-50/40 to-gray-50 border-b border-gray-200/80 pt-10 pb-8 md:pb-10">
        <!-- Floating background decorative icons -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            @foreach($heroIcons as [$icon, $x, $y, $size, $rot])
            <i class="fas {{ $icon }} absolute text-primary/10 hidden md:block"
               style="left: {{ $x }}%; top: {{ $y }}%; font-size: {{ $size }}px; transform: rotate({{ $rot }}deg);"></i>
            @endforeach
        </div>

        <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <!-- Headline / Subtitle -->
            <div class="max-w-2xl mx-auto mb-6">
                <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2"
                    x-text="selectedParentCategoryLabel || '{{ __('Vacancies') }}'">
                    {{ $selectedCategory?->name ?: __('Vacancies') }}
                </h1>
                <p class="text-xs sm:text-sm md:text-base text-gray-500">
                    {{ __('Azərbaycanın aparıcı şirkətlərində minlərlə aktiv iş elanı və karyera imkanları') }}
                </p>
            </div>

            <!-- White Search & Filter Card -->
            <div class="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-orange-100 p-3.5 sm:p-5 text-left relative z-20">

                <!-- Row 1: Search Keyword, City Selector, Desktop Action Button -->
                <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_14rem_auto] lg:grid-cols-[minmax(0,1fr)_16rem_auto] items-stretch gap-2.5">

                    <!-- Search Input -->
                    <div class="relative flex-1">
                        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                        <input type="text"
                               x-model="q"
                               @input.debounce.400ms="applyFilters()"
                               @keydown.enter.prevent="applyFilters()"
                               placeholder="{{ __('Profession, role or company') }}..."
                               class="w-full h-12 pl-11 pr-10 bg-gray-50/70 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-orange-100 transition">
                        <button type="button"
                                x-show="q"
                                x-cloak
                                @click="q = ''; applyFilters()"
                                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1 text-xs">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- City Selector -->
                    <div class="relative w-full" :class="cityOpen ? 'z-50' : 'z-auto'" x-data="{ cityOpen: false }" @click.outside="cityOpen = false">
                        <button type="button"
                                @click="cityOpen = !cityOpen"
                                class="w-full h-12 flex items-center justify-between pl-10 pr-3.5 bg-gray-50/70 hover:bg-white border border-gray-200 rounded-xl text-sm transition cursor-pointer text-left focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-orange-100">
                            <i class="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                            <span class="truncate" :class="city.length ? 'text-gray-900 font-medium' : 'text-gray-400'"
                                  x-text="selectedCityLabel || '{{ __('City (Baku...)') }}'"></span>
                            <i class="fas fa-chevron-down text-[10px] text-gray-400 transition-transform ml-2 shrink-0" :class="cityOpen ? 'rotate-180 text-primary' : ''"></i>
                        </button>

                        <!-- City Dropdown Popover -->
                        <div x-show="cityOpen"
                             x-cloak
                             x-transition:enter="transition ease-out duration-100"
                             x-transition:enter-start="transform opacity-0 scale-95"
                             x-transition:enter-end="transform opacity-100 scale-100"
                             x-transition:leave="transition ease-in duration-75"
                             x-transition:leave-start="transform opacity-100 scale-100"
                             x-transition:leave-end="transform opacity-0 scale-95"
                             class="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl p-2 z-[100] max-h-64 overflow-y-auto">

                            <button type="button"
                                    @click="clearCity(); cityOpen = false"
                                    class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-between cursor-pointer transition"
                                    :class="city.length === 0 ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700'">
                                <span>{{ __('All cities') }}</span>
                                <i class="fas fa-check text-[10px]" x-show="city.length === 0"></i>
                            </button>

                            @foreach($cities as $c)
                            <button type="button"
                                    @click="toggleCity('{{ $c->slug }}'); cityOpen = false"
                                    class="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-gray-50 flex items-center justify-between cursor-pointer transition"
                                    :class="city.includes('{{ $c->slug }}') ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700'">
                                <span>{{ $c->name }}</span>
                                <span class="text-[11px] text-gray-400 font-mono"
                                      x-show="getCount('cities', '{{ $c->slug }}', {{ $c->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('cities', '{{ $c->slug }}', {{ $c->vacancies_count }}) + ')'"></span>
                            </button>
                            @endforeach
                        </div>
                    </div>

                    <!-- Search Button -->
                    <button type="button"
                            @click="applyFilters()"
                            class="hidden md:flex h-12 bg-primary hover:bg-primary-dark text-white font-semibold px-7 rounded-xl transition-all items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer whitespace-nowrap">
                        <i class="fas fa-search text-xs"></i>
                        <span>{{ __('Search') }}</span>
                    </button>

                </div>

                <!-- Row 2: Filter Pills & Reset Button -->
                <div class="grid grid-cols-2 md:flex md:flex-wrap xl:flex-nowrap items-center gap-2 xl:gap-1.5 p-2.5 mt-3 rounded-xl bg-slate-50/80 border border-slate-100 relative" :class="activeDropdown ? 'z-40' : 'z-10'">

                    <!-- 1. Category Filter Dropdown -->
                    <div class="relative" :class="activeDropdown === 'category' ? 'z-50' : 'z-auto'" @click.outside="closeDropdown('category')">
                        <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('Category') }}</span>
                        <button type="button"
                                @click="toggleDropdown('category')"
                                class="w-full md:w-auto inline-flex items-center justify-between md:justify-start gap-1.5 px-3.5 xl:px-2.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer"
                                :class="selectedParentCategorySlug ? 'bg-orange-50 border-orange-200 text-primary font-semibold' : 'bg-gray-50/80 border-gray-200/80 text-gray-700 hover:bg-white hover:border-gray-300'">
                            <span class="hidden md:inline text-gray-400 font-normal">{{ __('Category') }}:</span>
                            <span class="truncate max-w-[140px]" :class="selectedParentCategorySlug ? 'text-primary font-semibold' : 'text-gray-800 font-medium'" x-text="selectedParentCategoryLabel || '{{ __('All') }}'"></span>
                            <i class="fas fa-chevron-down text-[10px] transition-transform ml-0.5" :class="activeDropdown === 'category' ? 'rotate-180 text-primary' : 'text-gray-400'"></i>
                        </button>

                        <div x-show="activeDropdown === 'category'"
                             x-cloak
                             x-transition
                             class="absolute left-0 top-full mt-2 w-72 sm:w-80 max-h-80 overflow-y-auto rounded-2xl bg-white border border-gray-100 shadow-2xl p-2 z-[100]">

                            <button type="button"
                                    @click="setParentCategory('')"
                                    class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-50 flex items-center justify-between cursor-pointer transition"
                                    :class="!selectedParentCategorySlug ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700'">
                                <span>{{ __('All categories') }}</span>
                                <i class="fas fa-check text-[10px]" x-show="!selectedParentCategorySlug"></i>
                            </button>

                            <div class="border-t border-gray-100 my-1"></div>

                            @foreach($categories as $cat)
                            <button type="button"
                                    @click="setParentCategory('{{ $cat->slug }}')"
                                    class="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-gray-50 flex items-center justify-between cursor-pointer transition"
                                    :class="selectedParentCategorySlug === '{{ $cat->slug }}' ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700'">
                                <span class="truncate">{{ $cat->name }}</span>
                                <span class="text-[11px] text-gray-400 font-mono ml-1"
                                      x-show="getCategoryCount('{{ $cat->slug }}', {{ $cat->vacancies_count }}) > 0"
                                      x-text="'(' + getCategoryCount('{{ $cat->slug }}', {{ $cat->vacancies_count }}) + ')'"></span>
                            </button>
                            @endforeach
                        </div>
                    </div>

                    <!-- 2. Subcategory Filter Dropdown -->
                    <div class="relative" :class="activeDropdown === 'subcategory' ? 'z-50' : 'z-auto'" @click.outside="closeDropdown('subcategory')">
                        <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('Subcategory') }}</span>
                        <button type="button"
                                @click="if (availableSubcategories.length) { toggleDropdown('subcategory'); }"
                                :disabled="!availableSubcategories.length"
                                class="w-full md:w-auto inline-flex items-center justify-between md:justify-start gap-1.5 px-3.5 xl:px-2.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition"
                                :class="{
                                    'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400': !availableSubcategories.length,
                                    'cursor-pointer bg-orange-50 border-orange-200 text-primary font-semibold': availableSubcategories.length && selectedSubcategorySlugs.length > 0,
                                    'cursor-pointer bg-gray-50/80 border-gray-200/80 text-gray-700 hover:bg-white hover:border-gray-300': availableSubcategories.length && selectedSubcategorySlugs.length === 0
                                }">
                            <span class="hidden md:inline text-gray-400 font-normal">{{ __('Subcategory') }}:</span>
                            <span class="truncate max-w-[140px]" :class="selectedSubcategorySlugs.length > 0 ? 'text-primary font-semibold' : 'text-gray-800 font-medium'" x-text="!availableSubcategories.length ? '—' : (selectedSubcategoryLabel || '{{ __('All') }}')"></span>
                            <i class="fas fa-chevron-down text-[10px] transition-transform ml-0.5"
                               :class="{
                                   'text-gray-300': !availableSubcategories.length,
                                   'text-gray-400': availableSubcategories.length && activeDropdown !== 'subcategory',
                                   'rotate-180 text-primary': activeDropdown === 'subcategory'
                               }"></i>
                        </button>

                        <div x-show="activeDropdown === 'subcategory' && availableSubcategories.length > 0"
                             x-cloak
                             x-transition
                             class="absolute left-0 top-full mt-2 w-72 sm:w-80 max-h-80 overflow-y-auto rounded-2xl bg-white border border-gray-100 shadow-2xl p-2 z-[100] space-y-1">

                            <button type="button"
                                    @click="clearSubcategories()"
                                    class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-50 flex items-center justify-between cursor-pointer transition"
                                    :class="selectedSubcategorySlugs.length === 0 ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700'">
                                <span>{{ __('All subcategories') }}</span>
                                <i class="fas fa-check text-[10px]" x-show="selectedSubcategorySlugs.length === 0"></i>
                            </button>

                            <div class="border-t border-gray-100 my-1"></div>

                            <template x-for="subSlug in availableSubcategories" :key="subSlug">
                                <label class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition text-left cursor-pointer select-none"
                                       :class="isSubcategorySelected(subSlug) ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'">
                                    <span class="flex items-center gap-2 truncate pr-2">
                                        <input type="checkbox"
                                               :value="subSlug"
                                               :checked="isSubcategorySelected(subSlug)"
                                               @change="toggleSubcategory(subSlug)"
                                               class="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 shrink-0">
                                        <span class="truncate" x-text="categoryNameMap[subSlug] || subSlug"></span>
                                    </span>
                                    <span class="text-[11px] text-gray-400 font-mono shrink-0 ml-1"
                                          x-show="getCategoryCount(subSlug, 0) > 0"
                                          x-text="'(' + getCategoryCount(subSlug, 0) + ')'"></span>
                                </label>
                            </template>
                        </div>
                    </div>

                    <!-- 3. Workplace Type (İş rejimi) Dropdown -->
                    @if($workplaceTypes->count() > 0)
                    <div class="hidden md:block relative" :class="activeDropdown === 'workplace' ? 'z-50' : 'z-auto'" @click.outside="closeDropdown('workplace')">
                        <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('Workplace') }}</span>
                        <button type="button"
                                @click="toggleDropdown('workplace')"
                                class="w-full md:w-auto inline-flex items-center justify-between md:justify-start gap-1.5 px-3.5 xl:px-2.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer"
                                :class="workplace.length > 0 ? 'bg-orange-50 border-orange-200 text-primary font-semibold' : 'bg-gray-50/80 border-gray-200/80 text-gray-700 hover:bg-white hover:border-gray-300'">
                            <span class="hidden md:inline text-gray-400 font-normal">{{ __('Workplace') }}:</span>
                            <span class="truncate max-w-[130px]" :class="workplace.length > 0 ? 'text-primary font-semibold' : 'text-gray-800 font-medium'" x-text="selectedWorkplaceLabel || '{{ __('All') }}'"></span>
                            <i class="fas fa-chevron-down text-[10px] transition-transform" :class="activeDropdown === 'workplace' ? 'rotate-180 text-primary' : 'text-gray-400'"></i>
                        </button>

                        <div x-show="activeDropdown === 'workplace'"
                             x-cloak
                             x-transition
                             class="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-white border border-gray-100 shadow-2xl p-2 z-[100] space-y-1">

                            <button type="button"
                                    @click="workplace = []; applyFilters(); closeDropdown('workplace')"
                                    class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-50 flex items-center justify-between cursor-pointer transition"
                                    :class="workplace.length === 0 ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700'">
                                <span>{{ __('All work modes') }}</span>
                                <i class="fas fa-check text-[10px]" x-show="workplace.length === 0"></i>
                            </button>

                            <div class="border-t border-gray-100 my-1"></div>

                            @foreach($workplaceTypes as $wt)
                            <label class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition text-left cursor-pointer select-none"
                                   :class="workplace.includes('{{ $wt->slug }}') ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'">
                                <span class="flex items-center gap-2">
                                    <input type="checkbox"
                                           value="{{ $wt->slug }}"
                                           :checked="workplace.includes('{{ $wt->slug }}')"
                                           @change="toggleFilter('workplace', '{{ $wt->slug }}')"
                                           class="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5">
                                    <span>{{ $wt->name }}</span>
                                </span>
                                <span class="text-[11px] text-gray-400 font-mono"
                                      x-show="getCount('workplaceTypes', '{{ $wt->slug }}', {{ $wt->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('workplaceTypes', '{{ $wt->slug }}', {{ $wt->vacancies_count }}) + ')'"></span>
                            </label>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <!-- 4. Experience Level (Təcrübə) Dropdown -->
                    @if($experienceLevels->count() > 0)
                    <div class="hidden md:block relative" :class="activeDropdown === 'experience' ? 'z-50' : 'z-auto'" @click.outside="closeDropdown('experience')">
                        <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('Experience') }}</span>
                        <button type="button"
                                @click="toggleDropdown('experience')"
                                class="w-full md:w-auto inline-flex items-center justify-between md:justify-start gap-1.5 px-3.5 xl:px-2.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer"
                                :class="experience.length > 0 ? 'bg-orange-50 border-orange-200 text-primary font-semibold' : 'bg-gray-50/80 border-gray-200/80 text-gray-700 hover:bg-white hover:border-gray-300'">
                            <span class="hidden md:inline text-gray-400 font-normal">{{ __('Experience') }}:</span>
                            <span class="truncate max-w-[130px]" :class="experience.length > 0 ? 'text-primary font-semibold' : 'text-gray-800 font-medium'" x-text="selectedExperienceLabel || '{{ __('All') }}'"></span>
                            <i class="fas fa-chevron-down text-[10px] transition-transform" :class="activeDropdown === 'experience' ? 'rotate-180 text-primary' : 'text-gray-400'"></i>
                        </button>

                        <div x-show="activeDropdown === 'experience'"
                             x-cloak
                             x-transition
                             class="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-white border border-gray-100 shadow-2xl p-2 z-[100] space-y-1">

                            <button type="button"
                                    @click="experience = []; applyFilters(); closeDropdown('experience')"
                                    class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-50 flex items-center justify-between cursor-pointer transition"
                                    :class="experience.length === 0 ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700'">
                                <span>{{ __('All experience levels') }}</span>
                                <i class="fas fa-check text-[10px]" x-show="experience.length === 0"></i>
                            </button>

                            <div class="border-t border-gray-100 my-1"></div>

                            @foreach($experienceLevels as $el)
                            <label class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition text-left cursor-pointer select-none"
                                   :class="experience.includes('{{ $el->slug }}') ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'">
                                <span class="flex items-center gap-2">
                                    <input type="checkbox"
                                           value="{{ $el->slug }}"
                                           :checked="experience.includes('{{ $el->slug }}')"
                                           @change="toggleFilter('experience', '{{ $el->slug }}')"
                                           class="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5">
                                    <span>{{ $el->name }}</span>
                                </span>
                                <span class="text-[11px] text-gray-400 font-mono"
                                      x-show="getCount('experienceLevels', '{{ $el->slug }}', {{ $el->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('experienceLevels', '{{ $el->slug }}', {{ $el->vacancies_count }}) + ')'"></span>
                            </label>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <!-- 5. Salary (Maaş) Dropdown -->
                    <div class="relative" :class="activeDropdown === 'salary' ? 'z-50' : 'z-auto'" @click.outside="closeDropdown('salary')">
                        <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('Salary') }}</span>
                        <button type="button"
                                @click="toggleDropdown('salary')"
                                class="w-full md:w-auto inline-flex items-center justify-between md:justify-start gap-1.5 px-3.5 xl:px-2.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer"
                                :class="(min_salary || max_salary) ? 'bg-orange-50 border-orange-200 text-primary font-semibold' : 'bg-gray-50/80 border-gray-200/80 text-gray-700 hover:bg-white hover:border-gray-300'">
                            <span class="hidden md:inline text-gray-400 font-normal">{{ __('Salary') }}:</span>
                            <span class="truncate max-w-[140px]" :class="(min_salary || max_salary) ? 'text-primary font-semibold' : 'text-gray-800 font-medium'" x-text="salaryLabel || '{{ __('All') }}'"></span>
                            <i class="fas fa-chevron-down text-[10px] transition-transform" :class="activeDropdown === 'salary' ? 'rotate-180 text-primary' : 'text-gray-400'"></i>
                        </button>

                        <div x-show="activeDropdown === 'salary'"
                             x-cloak
                             x-transition
                             class="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-gray-100 shadow-2xl p-4 z-[100] space-y-3">

                            <div class="flex items-center justify-between">
                                <span class="text-xs font-semibold text-gray-800">{{ __('Salary (AZN)') }}</span>
                                <button type="button"
                                        x-show="min_salary || max_salary"
                                        x-cloak
                                        @click="min_salary = ''; max_salary = ''; applyFilters()"
                                        class="text-xs text-primary hover:text-primary-dark font-medium cursor-pointer">
                                    {{ __('Reset') }}
                                </button>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div class="relative flex items-center">
                                    <span class="absolute left-3 text-gray-400 text-xs font-medium pointer-events-none select-none">₼</span>
                                    <input type="number"
                                           x-model="min_salary"
                                           @keydown.enter.prevent="applyFilters(); closeDropdown('salary')"
                                           placeholder="{{ __('Min') }}"
                                           min="0"
                                           class="w-full pl-7 pr-2 py-2 bg-gray-50 focus:bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary">
                                </div>
                                <div class="relative flex items-center">
                                    <span class="absolute left-3 text-gray-400 text-xs font-medium pointer-events-none select-none">₼</span>
                                    <input type="number"
                                           x-model="max_salary"
                                           @keydown.enter.prevent="applyFilters(); closeDropdown('salary')"
                                           placeholder="{{ __('Max') }}"
                                           min="0"
                                           class="w-full pl-7 pr-2 py-2 bg-gray-50 focus:bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary">
                                </div>
                            </div>

                            <!-- Quick Preset Ranges -->
                            <div class="flex flex-wrap gap-1.5 pt-1">
                                <button type="button" @click="min_salary = '500'; max_salary = '1000'; applyFilters()"
                                        class="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 cursor-pointer">500 - 1000</button>
                                <button type="button" @click="min_salary = '1000'; max_salary = '2000'; applyFilters()"
                                        class="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 cursor-pointer">1000 - 2000</button>
                                <button type="button" @click="min_salary = '2000'; max_salary = '3000'; applyFilters()"
                                        class="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 cursor-pointer">2000 - 3000</button>
                                <button type="button" @click="min_salary = '3000'; max_salary = ''; applyFilters()"
                                        class="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 cursor-pointer">3000+ ₼</button>
                            </div>

                            <button type="button"
                                    @click="applyFilters(); closeDropdown('salary')"
                                    class="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs">
                                {{ __('Apply') }}
                            </button>
                        </div>
                    </div>

                    <!-- 6. More Filters (Daha çox filtr) -->
                    <div class="md:contents">
                        <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('More filters') }}</span>
                        <button type="button"
                                @click="moreFiltersOpen = true"
                                class="w-full md:w-auto inline-flex shrink-0 items-center justify-center md:justify-start gap-1.5 px-3.5 xl:px-2.5 py-2 rounded-xl border border-gray-200/80 bg-gray-50/80 text-gray-700 hover:bg-white hover:border-gray-300 text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer"
                                :class="moreFiltersCount > 0 ? 'bg-orange-50 border-orange-200 text-primary font-semibold' : ''">
                            <i class="fas fa-sliders-h text-xs" :class="moreFiltersCount > 0 ? 'text-primary' : 'text-gray-400'"></i>
                            <span>{{ __('More filters') }}</span>
                            <span x-show="moreFiltersCount > 0" x-cloak class="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold leading-none" x-text="moreFiltersCount"></span>
                        </button>
                    </div>

                    <!-- 7. Reset Filters -->
                    <button type="button"
                            x-show="hasActiveFilters"
                            x-cloak
                            @click="resetAllFilters()"
                            class="col-span-2 md:col-span-1 text-xs text-gray-400 hover:text-primary flex items-center justify-center gap-1.5 font-medium transition cursor-pointer md:ml-auto py-1.5 px-2 rounded-lg hover:bg-gray-50">
                        <i class="fas fa-rotate-left text-[11px]"></i>
                        <span>{{ __('Reset filters') }}</span>
                    </button>

                </div>

                <!-- Mobile Action Button -->
                <button type="button"
                        @click="applyFilters()"
                        class="md:hidden mt-3 w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold px-7 rounded-xl transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer">
                    <i class="fas fa-search text-xs"></i>
                    <span>{{ __('Search') }}</span>
                </button>

            </div>

        </div>
    </section>

    <!-- Main Content: Vacancies List (Full-Width) -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
        <div class="max-w-5xl mx-auto w-full">

            <!-- List Header: Count & Sort -->
            <div class="flex flex-row justify-between items-center gap-2 sm:gap-3 mb-5 pb-3 border-b border-gray-200">
                <div class="flex items-center gap-2 min-w-0">
                    <p class="text-xs sm:text-sm text-gray-500 leading-tight">
                        <span class="font-semibold text-primary" x-text="totalCount">{{ $jobs->total() }}</span> {{ __('active job listings found') }}
                    </p>
                    <span x-show="isLoading" x-cloak class="inline-block animate-spin text-primary text-xs">
                        <i class="fas fa-spinner"></i>
                    </span>
                </div>

                <div class="flex items-center gap-2 text-xs shrink-0">
                    <span class="text-gray-500 hidden sm:inline">{{ __('Sort by:') }}</span>
                    <select x-model="sort"
                            @change="applyFilters()"
                            class="w-[180px] sm:w-auto text-xs border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                        <option value="latest">{{ __('By date (newest)') }}</option>
                        <option value="oldest">{{ __('By date (oldest)') }}</option>
                        <option value="salary_desc">{{ __('Sort by salary (high to low)') }}</option>
                        <option value="salary_asc">{{ __('Sort by salary (low to high)') }}</option>
                        <option value="views">{{ __('Most viewed') }}</option>
                        <option value="deadline">{{ __('By latest application date') }}</option>
                        <option value="featured">{{ __('Premium listings') }}</option>
                        <option value="title_asc">{{ __('Alphabetical order (A-Z)') }}</option>
                        <option value="title_desc">{{ __('Alphabetical order (Z-A)') }}</option>
                    </select>
                </div>
            </div>

            <!-- Async Jobs Container with Loading State -->
            <div id="jobs-container" class="relative min-h-[300px]" :class="isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-150' : ''">
                @include('pages.jobs.partials.job-list', ['jobs' => $jobs, 'selectedCategory' => $selectedCategory])
            </div>

        </div>
    </div>

    <!-- More Filters Modal -->
    <div x-show="moreFiltersOpen"
         x-cloak
         class="fixed inset-0 z-50 overflow-y-auto"
         role="dialog"
         aria-modal="true">
        <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity" @click="moreFiltersOpen = false"></div>

        <div class="min-h-full flex items-center justify-center p-4">
            <div class="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]"
                 @click.outside="moreFiltersOpen = false">

                <!-- Modal Header -->
                <div class="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-sm font-semibold">
                            <i class="fas fa-sliders-h"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 text-base">{{ __('More filters') }}</h3>
                            <p class="text-[11px] text-gray-400">{{ __('Detailed filters and skills') }}</p>
                        </div>
                        <span x-show="moreFiltersCount > 0" x-cloak class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold ml-2" x-text="moreFiltersCount + ' {{ __('active') }}'"></span>
                    </div>
                    <button type="button" @click="moreFiltersOpen = false" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                        <i class="fas fa-times text-base"></i>
                    </button>
                </div>

                <!-- Modal Body (Scrollable) -->
                <div class="overflow-y-auto py-5 pr-1 space-y-5 text-left flex-1">

                    <!-- 1. Category & Subcategory -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <label class="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fas fa-th-large text-primary text-xs"></i>
                                <span>{{ __('Category') }}</span>
                            </label>
                            <span class="text-xs text-primary font-medium" x-text="selectedParentCategoryLabel || '{{ __('All categories') }}'"></span>
                        </div>

                        <select class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-primary text-gray-800 cursor-pointer font-medium"
                                :value="selectedParentCategorySlug"
                                @change="setParentCategory($event.target.value)">
                            <option value="">{{ __('All categories') }}</option>
                            @foreach($categories as $cat)
                            <option value="{{ $cat->slug }}">{{ $cat->name }} ({{ $cat->vacancies_count }})</option>
                            @endforeach
                        </select>

                        <!-- Subcategory chips / multiselect -->
                        <div x-show="availableSubcategories.length > 0" x-cloak class="pt-2 border-t border-gray-100 space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-semibold text-gray-700">{{ __('Subcategories') }}</span>
                                <button type="button" x-show="selectedSubcategorySlugs.length > 0" @click="clearSubcategories()" class="text-[11px] text-primary hover:underline cursor-pointer">{{ __('All subcategories') }}</button>
                            </div>
                            <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-gray-50/70 rounded-xl border border-gray-100">
                                <template x-for="subSlug in availableSubcategories" :key="subSlug">
                                    <button type="button"
                                            @click="toggleSubcategory(subSlug)"
                                            class="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5"
                                            :class="isSubcategorySelected(subSlug) ? 'bg-orange-50 border-orange-200 text-primary font-semibold shadow-2xs' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'">
                                        <i class="fas fa-check text-[9px]" x-show="isSubcategorySelected(subSlug)"></i>
                                        <span x-text="categoryNameMap[subSlug] || subSlug"></span>
                                        <span class="text-[10px] text-gray-400 font-mono" x-show="getCategoryCount(subSlug, 0) > 0" x-text="'(' + getCategoryCount(subSlug, 0) + ')'"></span>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Category Skills -->
                    <div class="space-y-3 pt-4 border-t border-gray-100">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-certificate text-primary text-xs"></i>
                                <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">{{ __('Skills (Tags)') }}</h4>
                                <span x-show="skills.length > 0" class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold" x-text="skills.length + ' {{ __('selected') }}'"></span>
                            </div>
                            <button type="button"
                                    x-show="skills.length > 0"
                                    x-cloak
                                    @click="clearSkills()"
                                    class="text-xs text-primary hover:underline font-medium cursor-pointer">
                                {{ __('Clear skills') }}
                            </button>
                        </div>

                        <!-- Quick Search Input for Skills -->
                        <div class="relative" x-show="availableSkills.length > 6">
                            <i class="fas fa-search absolute left-3 top-2.5 text-xs text-gray-400 pointer-events-none"></i>
                            <input type="text"
                                   x-model="skillSearch"
                                   placeholder="{{ __('Search skills in this category...') }}"
                                   class="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-gray-700 placeholder-gray-400">
                        </div>

                        <!-- Loading State -->
                        <div x-show="skillsLoading" class="py-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                            <i class="fas fa-spinner animate-spin text-primary"></i>
                            <span>{{ __('Loading skills...') }}</span>
                        </div>

                        <!-- Skills Chips -->
                        <div x-show="!skillsLoading && filteredAvailableSkills.length > 0"
                             class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-gray-50/70 rounded-xl border border-gray-100">
                            <template x-for="skill in filteredAvailableSkills" :key="skill.name">
                                <button type="button"
                                        @click="toggleSkill(skill.name)"
                                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 select-none"
                                        :class="isSkillSelected(skill.name) ? 'bg-primary border-primary text-white shadow-xs font-semibold' : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'">
                                    <span x-text="skill.name"></span>
                                    <i class="fas fa-check text-[10px]" x-show="isSkillSelected(skill.name)"></i>
                                </button>
                            </template>
                        </div>

                        <!-- If no skills match search -->
                        <div x-show="!skillsLoading && availableSkills.length > 0 && filteredAvailableSkills.length === 0" class="py-3 text-center text-xs text-gray-400">
                            {{ __('No skills match your search.') }}
                        </div>

                        <!-- If no category selected -->
                        <div x-show="!skillsLoading && availableSkills.length === 0" class="text-xs text-gray-500 bg-orange-50/70 border border-orange-200/70 rounded-xl p-3 flex items-center gap-2">
                            <i class="fas fa-info-circle text-primary shrink-0"></i>
                            <span>{{ __('Select a category above to view and filter by relevant skills.') }}</span>
                        </div>
                    </div>

                    <!-- 3. City / Location -->
                    @if($cities->count() > 0)
                    <div class="space-y-2 pt-4 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fas fa-location-dot text-primary text-xs"></i>
                            <span>{{ __('City') }}</span>
                        </h4>
                        <select class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-primary text-gray-700 cursor-pointer"
                                :value="city.length ? city[0] : ''"
                                @change="if ($event.target.value) { city = [$event.target.value]; } else { city = []; }">
                            <option value="">{{ __('All cities') }}</option>
                            @foreach($cities as $c)
                            <option value="{{ $c->slug }}">{{ $c->name }} ({{ $c->vacancies_count }})</option>
                            @endforeach
                        </select>
                    </div>
                    @endif

                    <!-- 4. Workplace Type -->
                    @if($workplaceTypes->count() > 0)
                    <div class="space-y-3 pt-4 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fas fa-building text-primary text-xs"></i>
                            <span>{{ __('Workplace') }}</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            @foreach($workplaceTypes as $wt)
                            <label class="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 transition cursor-pointer select-none text-xs"
                                   :class="workplace.includes('{{ $wt->slug }}') ? 'bg-orange-50 border-orange-300 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'">
                                <span class="flex items-center gap-2 truncate">
                                    <input type="checkbox"
                                           value="{{ $wt->slug }}"
                                           :checked="workplace.includes('{{ $wt->slug }}')"
                                           @change="toggleFilter('workplace', '{{ $wt->slug }}')"
                                           class="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5">
                                    <span class="truncate">{{ $wt->name }}</span>
                                </span>
                                <span class="text-[11px] text-gray-400 font-mono ml-1"
                                      x-show="getCount('workplaceTypes', '{{ $wt->slug }}', {{ $wt->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('workplaceTypes', '{{ $wt->slug }}', {{ $wt->vacancies_count }}) + ')'"></span>
                            </label>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <!-- 5. Experience Level -->
                    @if($experienceLevels->count() > 0)
                    <div class="space-y-3 pt-4 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fas fa-user-clock text-primary text-xs"></i>
                            <span>{{ __('Experience') }}</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            @foreach($experienceLevels as $el)
                            <label class="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 transition cursor-pointer select-none text-xs"
                                   :class="experience.includes('{{ $el->slug }}') ? 'bg-orange-50 border-orange-300 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'">
                                <span class="flex items-center gap-2 truncate">
                                    <input type="checkbox"
                                           value="{{ $el->slug }}"
                                           :checked="experience.includes('{{ $el->slug }}')"
                                           @change="toggleFilter('experience', '{{ $el->slug }}')"
                                           class="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5">
                                    <span class="truncate">{{ $el->name }}</span>
                                </span>
                                <span class="text-[11px] text-gray-400 font-mono ml-1"
                                      x-show="getCount('experienceLevels', '{{ $el->slug }}', {{ $el->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('experienceLevels', '{{ $el->slug }}', {{ $el->vacancies_count }}) + ')'"></span>
                            </label>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <!-- 6. Job Type (Employment Type) -->
                    @if($jobTypes->count() > 0)
                    <div class="space-y-3 pt-4 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fas fa-briefcase text-primary text-xs"></i>
                            <span>{{ __('Job type') }}</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            @foreach($jobTypes as $jt)
                            <label class="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 transition cursor-pointer select-none text-xs"
                                   :class="type.includes('{{ $jt->slug }}') ? 'bg-orange-50 border-orange-300 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'">
                                <span class="flex items-center gap-2 truncate">
                                    <input type="checkbox"
                                           value="{{ $jt->slug }}"
                                           :checked="type.includes('{{ $jt->slug }}')"
                                           @change="toggleFilter('type', '{{ $jt->slug }}')"
                                           class="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5">
                                    <span class="truncate">{{ $jt->name }}</span>
                                </span>
                                <span class="text-[11px] text-gray-400 font-mono ml-1"
                                      x-show="getCount('jobTypes', '{{ $jt->slug }}', {{ $jt->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('jobTypes', '{{ $jt->slug }}', {{ $jt->vacancies_count }}) + ')'"></span>
                            </label>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <!-- 7. Salary -->
                    <div class="space-y-3 pt-4 border-t border-gray-100">
                        <div class="flex items-center justify-between">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fas fa-wallet text-primary text-xs"></i>
                                <span>{{ __('Salary (AZN)') }}</span>
                            </h4>
                            <button type="button"
                                    x-show="min_salary || max_salary"
                                    x-cloak
                                    @click="min_salary = ''; max_salary = ''"
                                    class="text-xs text-primary hover:underline font-medium cursor-pointer">
                                {{ __('Reset') }}
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="relative flex items-center">
                                <span class="absolute left-3 text-gray-400 text-xs font-medium pointer-events-none select-none">₼</span>
                                <input type="number"
                                       x-model="min_salary"
                                       placeholder="{{ __('Min') }}"
                                       min="0"
                                       class="w-full pl-7 pr-2 py-2 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary">
                            </div>
                            <div class="relative flex items-center">
                                <span class="absolute left-3 text-gray-400 text-xs font-medium pointer-events-none select-none">₼</span>
                                <input type="number"
                                       x-model="max_salary"
                                       placeholder="{{ __('Max') }}"
                                       min="0"
                                       class="w-full pl-7 pr-2 py-2 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary">
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-1.5 pt-1">
                            <button type="button" @click="min_salary = '500'; max_salary = '1000'"
                                    class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 cursor-pointer">500 - 1000</button>
                            <button type="button" @click="min_salary = '1000'; max_salary = '2000'"
                                    class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 cursor-pointer">1000 - 2000</button>
                            <button type="button" @click="min_salary = '2000'; max_salary = '3000'"
                                    class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 cursor-pointer">2000 - 3000</button>
                            <button type="button" @click="min_salary = '3000'; max_salary = ''"
                                    class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700 cursor-pointer">3000+ ₼</button>
                        </div>
                    </div>

                    <!-- 8. Sort By -->
                    <div class="space-y-2 pt-4 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fas fa-sort text-primary text-xs"></i>
                            <span>{{ __('Sort by:') }}</span>
                        </h4>
                        <select x-model="sort"
                                class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-primary text-gray-700 cursor-pointer">
                            <option value="latest">{{ __('By date (newest)') }}</option>
                            <option value="oldest">{{ __('By date (oldest)') }}</option>
                            <option value="salary_desc">{{ __('Sort by salary (high to low)') }}</option>
                            <option value="salary_asc">{{ __('Sort by salary (low to high)') }}</option>
                            <option value="views">{{ __('Most viewed') }}</option>
                            <option value="deadline">{{ __('By latest application date') }}</option>
                            <option value="featured">{{ __('Premium listings') }}</option>
                            <option value="title_asc">{{ __('Alphabetical order (A-Z)') }}</option>
                            <option value="title_desc">{{ __('Alphabetical order (Z-A)') }}</option>
                        </select>
                    </div>

                </div>

                <!-- Footer Actions -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-100 shrink-0">
                    <button type="button"
                            @click="resetAllFilters()"
                            class="text-xs text-gray-500 hover:text-primary font-medium cursor-pointer flex items-center gap-1.5 py-2 px-1">
                        <i class="fas fa-rotate-left text-[11px]"></i>
                        <span>{{ __('Reset all filters') }}</span>
                    </button>
                    <button type="button"
                            @click="applyFilters(); moreFiltersOpen = false"
                            class="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs flex items-center gap-2">
                        <span>{{ __('Show results') }}</span>
                        <i class="fas fa-arrow-right text-[11px]"></i>
                    </button>
                </div>

            </div>
        </div>
    </div>

</div>
@endsection
