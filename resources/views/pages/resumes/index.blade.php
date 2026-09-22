@extends('layouts.app')

@section('title', __('Resume Database') . ' - ' . config('app.full_name'))
@section('meta_description', __('The CV database of the most talented professionals. Search for professional candidates and review their CVs.'))

@section('content')
<script>
window.__RESUMES_CONFIG__ = {
    initialQuery: @json(request('q', '')),
    initialCategory: @json(request('category', '')),
    initialSkills: @json(array_values((array) request('skills', []))),
    initialCity: @json(array_values((array) request('city', []))),
    initialSort: @json(request('sort', 'latest')),
    initialTotal: {{ (int) $resumes->total() }},
    initialCityCounts: @json($cityCounts),
    initialCategoryCounts: @json($categoryCounts),
    categorySkills: @json($categorySkillsMap),
    allSkills: @json($categories->flatMap(fn($c) => $c->skills->where('is_active', true))->map(fn($s) => ['id' => $s->id, 'name' => is_array($s->name) ? ($s->name['az'] ?? reset($s->name)) : $s->name])->unique('name')->values()),
    filterErrorMessage: @json(__('Filters could not be loaded. Please try again.'))
};
</script>

<div class="bg-gray-50 min-h-screen pb-16" x-data="resumesManager()">
    <div x-show="errorMessage" x-cloak class="container mx-auto px-4 pt-3">
        <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" x-text="errorMessage"></div>
    </div>

    <!-- Hero & Main Filters -->
    <x-list-hero :title="__('Resume Database')" :show-search="false">
        <div class="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-orange-100 p-3.5 sm:p-5 text-left">
            <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-stretch gap-2.5">
                <div class="relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
                    <input type="text"
                           x-model="q"
                           @input.debounce.400ms="applyFilters()"
                           @keydown.enter.prevent="applyFilters()"
                           placeholder="{{ __('Position, name, skill...') }}"
                           class="w-full h-12 pl-11 pr-10 bg-gray-50/70 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-orange-100 transition">
                    <button type="button" x-show="q" x-cloak @click="q = ''; applyFilters()"
                            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1 text-xs">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <button type="button" @click="applyFilters()"
                        class="hidden md:flex h-12 bg-primary hover:bg-primary-dark text-white font-semibold px-7 rounded-xl transition-all items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer whitespace-nowrap">
                    <i class="fas fa-search text-xs"></i>
                    <span>{{ __('Search') }}</span>
                </button>
            </div>

            <div class="grid grid-cols-2 md:flex md:flex-wrap items-end gap-2 p-2.5 mt-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <label class="block min-w-0 md:w-64">
                    <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('Category') }}</span>
                    <select x-model="category" @change="applyFilters()"
                            class="w-full h-10 bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 text-xs sm:text-sm font-medium text-gray-800 focus:outline-hidden focus:border-primary cursor-pointer">
                        <option value="">{{ __('All categories') }}</option>
                        @foreach($categories as $cat)
                            <option value="{{ $cat->slug }}">{{ $cat->name }}</option>
                        @endforeach
                    </select>
                </label>

                <label class="block min-w-0 md:w-56">
                    <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('City') }}</span>
                    <select :value="city[0] || ''"
                            @change="city = $event.target.value ? [$event.target.value] : []; applyFilters()"
                            class="w-full h-10 bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 text-xs sm:text-sm font-medium text-gray-800 focus:outline-hidden focus:border-primary cursor-pointer">
                        <option value="">{{ __('All cities') }}</option>
                        @foreach($cities as $c)
                            <option value="{{ $c }}">{{ $c }}</option>
                        @endforeach
                    </select>
                </label>

                <div class="col-span-2 md:col-span-1 md:contents">
                    <span class="block md:hidden text-[11px] font-medium text-gray-500 mb-1.5 px-0.5">{{ __('More filters') }}</span>
                    <button type="button" @click="mobileFiltersOpen = !mobileFiltersOpen"
                            class="w-full md:w-auto h-10 inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl border border-gray-200/80 bg-gray-50/80 text-gray-700 hover:bg-white hover:border-gray-300 text-xs sm:text-sm font-medium transition cursor-pointer">
                        <i class="fas fa-sliders-h text-gray-400 text-xs"></i>
                        <span>{{ __('More filters') }}</span>
                        <span x-show="skills.length" x-cloak class="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold" x-text="skills.length"></span>
                    </button>
                </div>

                <button type="button" x-show="hasActiveFilters" x-cloak @click="resetAllFilters()"
                        class="col-span-2 md:col-span-1 text-xs text-gray-400 hover:text-primary flex items-center justify-center gap-1.5 font-medium cursor-pointer md:ml-auto py-2 px-2 rounded-lg hover:bg-gray-50">
                    <i class="fas fa-rotate-left text-[11px]"></i>
                    <span>{{ __('Reset filters') }}</span>
                </button>
            </div>

            <button type="button" @click="applyFilters()"
                    class="md:hidden mt-3 w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold px-7 rounded-xl transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer">
                <i class="fas fa-search text-xs"></i>
                <span>{{ __('Search') }}</span>
            </button>
        </div>
    </x-list-hero>

    <!-- Main Content Container -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div class="flex flex-col gap-6 max-w-5xl mx-auto">

            <!-- More Filters Modal -->
            <div x-show="mobileFiltersOpen"
                 x-cloak
                 @keydown.escape.window="mobileFiltersOpen = false"
                 class="fixed inset-0 z-50 overflow-y-auto"
                 role="dialog"
                 aria-modal="true">
                <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-xs" @click="mobileFiltersOpen = false"></div>
                <div class="min-h-full flex items-center justify-center p-4">
                <div class="relative bg-white rounded-2xl border border-gray-200 p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                     @click.outside="mobileFiltersOpen = false">
                    <div class="space-y-5">

                        <!-- Filter Top Header -->
                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                            <h3 class="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                <i class="fas fa-filter text-xs text-primary"></i>
                                <span>{{ __('Filters') }}</span>
                            </h3>
                            <div class="flex items-center gap-2">
                                <button type="button"
                                        x-show="hasActiveFilters"
                                        x-cloak
                                        @click="resetAllFilters()"
                                        class="text-xs text-primary hover:text-primary-dark font-medium transition cursor-pointer">
                                    {{ __('Clear') }}
                                </button>
                                <button type="button" @click="mobileFiltersOpen = false"
                                        class="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                                        aria-label="{{ __('Close') }}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Skills Filter (Dynamically changes based on selected category) -->
                        <div class="pt-3 border-t border-gray-100">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-xs font-semibold text-gray-800">{{ __('Skills (Tags)') }}</h4>
                                <button type="button" x-show="skills.length" x-cloak @click="clearSkills()"
                                        class="text-[11px] text-primary hover:underline font-medium cursor-pointer">
                                    {{ __('Clear skills') }}
                                </button>
                            </div>

                            <!-- Skills Tags -->
                            <div class="flex flex-wrap gap-1.5 text-xs max-h-60 overflow-y-auto p-2 bg-gray-50/70 rounded-xl border border-gray-100">
                                <template x-for="sk in filteredSkills" :key="sk.name">
                                    <button type="button" @click="toggleSkill(sk.name)"
                                            class="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer inline-flex items-center gap-1.5 select-none"
                                            :class="isSkillSelected(sk.name) ? 'bg-primary border-primary text-white font-semibold' : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'">
                                        <span x-text="sk.name"></span>
                                        <i class="fas fa-check text-[10px]" x-show="isSkillSelected(sk.name)"></i>
                                    </button>
                                </template>

                                <div x-show="filteredSkills.length === 0" x-cloak class="w-full py-3 text-center text-xs text-gray-400">
                                    {{ __('No skills found for this category') }}
                                </div>
                            </div>
                        </div>

                        <!-- City Filter -->
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-medium text-gray-800 mb-2.5">{{ __('City') }}</h4>
                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                @foreach($cities as $c)
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none"
                                       :class="city.includes('{{ addslashes($c) }}') ? 'bg-orange-50 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'">
                                    <input type="checkbox"
                                           value="{{ $c }}"
                                           :checked="city.includes('{{ addslashes($c) }}')"
                                           @change="toggleCity('{{ addslashes($c) }}')"
                                           class="sr-only">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px]"
                                              :class="city.includes('{{ addslashes($c) }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                            <i class="fas fa-check" x-show="city.includes('{{ addslashes($c) }}')"></i>
                                        </span>
                                        <span>{{ $c }}</span>
                                    </span>
                                    <span class="text-[11px] text-gray-400 font-mono"
                                          x-show="getCityCount('{{ addslashes($c) }}', {{ $cityCounts[$c] ?? 0 }}) > 0"
                                          x-text="'(' + getCityCount('{{ addslashes($c) }}', {{ $cityCounts[$c] ?? 0 }}) + ')'"></span>
                                </label>
                                @endforeach

                                @if(count($cities) > 5)
                                <button type="button" @click="showAll = !showAll"
                                        class="w-full text-left px-2.5 py-1.5 text-[12px] font-semibold text-primary hover:text-primary-dark cursor-pointer">
                                    <i class="fas fa-chevron-down text-[9px] mr-1 transition-transform" :class="showAll ? 'rotate-180' : ''"></i>
                                    <span x-text="showAll ? '{{ __('Show less') }}' : '{{ __('Show more') }} (' + ({{ count($cities) }} - 5) + ')'"></span>
                                </button>
                                @endif
                            </div>
                        </div>

                    </div>
                </div>
                </div>
            </div>

            <!-- List Area -->
            <div class="w-full">

                <!-- List Header (Count + Sorting) -->
                <div class="flex flex-row justify-between items-center gap-2 sm:gap-3 mb-5 pb-3 border-b border-gray-200">
                    <p class="text-xs sm:text-sm text-gray-500 leading-tight">
                        <span class="font-semibold text-primary" x-text="totalCount">{{ $resumes->total() }}</span> {{ __('candidate resumes found') }}
                    </p>

                    <div class="flex items-center gap-2 text-xs shrink-0">
                        <span class="text-gray-500 hidden sm:inline">{{ __('Sort by:') }}</span>
                        <select x-model="sort"
                                @change="applyFilters()"
                                class="w-[180px] sm:w-auto text-xs border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                            <option value="latest">{{ __('By date (newest)') }}</option>
                            <option value="oldest">{{ __('By date (oldest)') }}</option>
                            <option value="alphabetical">{{ __('Alphabetical order (A-Z)') }}</option>
                            <option value="alphabetical_desc">{{ __('Alphabetical order (Z-A)') }}</option>
                        </select>
                    </div>
                </div>

                <!-- Resumes Container -->
                <div id="resumes-container" class="relative min-h-[300px]" :class="isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-150' : ''">
                    @include('pages.resumes.partials.resume-list', ['resumes' => $resumes])
                </div>

            </div>

        </div>
    </div>
</div>
@endsection
