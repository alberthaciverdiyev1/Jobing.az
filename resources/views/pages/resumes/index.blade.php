@extends('layouts.app')

@section('title', __('CV Bazası') . ' - ' . config('app.full_name'))
@section('meta_description', __('Ən istedadlı mütəxəssislərin CV bazası. Şirkətlər üçün peşəkar namizədləri axtarın və CV-lərini incələyin.'))

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
    categorySkills: @json($categorySkillsMap),
    allSkills: @json($categories->flatMap(fn($c) => $c->skills->where('is_active', true))->map(fn($s) => ['id' => $s->id, 'name' => is_array($s->name) ? ($s->name['az'] ?? reset($s->name)) : $s->name])->unique('name')->values())
};
</script>

<div class="bg-gray-50 min-h-screen pb-16">

    <!-- Main Content Container -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="resumesManager()">

        <!-- Mobile Filter Trigger -->
        <div class="lg:hidden mb-4">
            <button type="button"
                    @click="mobileFiltersOpen = !mobileFiltersOpen"
                    class="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-2xs cursor-pointer">
                <span class="flex items-center gap-2">
                    <i class="fas fa-sliders-h text-primary"></i>
                    <span>{{ __('Filtrlər') }}</span>
                </span>
                <i class="fas fa-chevron-down text-[10px] text-gray-400 transition-transform" :class="mobileFiltersOpen ? 'rotate-180' : ''"></i>
            </button>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">

            <!-- Sidebar Filters -->
            <div class="lg:w-1/4 w-full" :class="mobileFiltersOpen ? 'block' : 'hidden lg:block'">
                <div class="bg-white rounded-xl border border-gray-200 p-5 sticky top-24 space-y-5 shadow-2xs">
                    <div class="space-y-5">

                        <!-- Filter Top Header -->
                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                            <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <i class="fas fa-filter text-xs text-primary"></i>
                                <span>{{ __('Filtrlər') }}</span>
                            </h3>
                            <button type="button"
                                    x-show="hasActiveFilters"
                                    x-cloak
                                    @click="resetAllFilters()"
                                    class="text-xs text-primary hover:text-primary-dark font-medium transition cursor-pointer">
                                {{ __('Təmizlə') }}
                            </button>
                        </div>

                        <!-- Search Input in Sidebar -->
                        <div>
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">{{ __('Axtarış') }}</h4>
                            <div class="relative">
                                <input type="text"
                                       x-model="q"
                                       @input.debounce.400ms="applyFilters()"
                                       @keydown.enter.prevent="applyFilters()"
                                       placeholder="{{ __('Vəzifə, ad, bacarıq...') }}"
                                       class="w-full pl-8 pr-7 py-2 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-xs transition">
                                <i class="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]"></i>
                                <button type="button"
                                        x-show="q"
                                        x-cloak
                                        @click="q = ''; applyFilters()"
                                        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Category Selection (Dynamically switches skills below) -->
                        <div class="pt-3 border-t border-gray-100">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">{{ __('Kateqoriya') }}</h4>
                                <button type="button"
                                        x-show="category !== ''"
                                        x-cloak
                                        @click="selectCategory('')"
                                        class="text-[10px] text-primary font-bold hover:underline cursor-pointer">
                                    {{ __('Bütün kateqoriyalar') }}
                                </button>
                            </div>

                            <div class="space-y-1 text-xs">
                                <button type="button"
                                        @click="selectCategory('')"
                                        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                        :class="category === '' ? 'bg-orange-50 text-primary font-bold border border-orange-200 shadow-2xs' : 'text-gray-600 hover:bg-gray-50 border border-transparent'">
                                    <span class="flex items-center gap-2">
                                        <span>{{ __('Bütün Sahələr') }}</span>
                                    </span>
                                </button>

                                @foreach($categories as $cat)
                                <button type="button"
                                        @click="selectCategory('{{ $cat->slug }}')"
                                        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                        :class="isCategoryActive('{{ $cat->slug }}') ? 'bg-orange-50 text-primary font-bold border border-orange-200 shadow-2xs' : 'text-gray-600 hover:bg-gray-50 border border-transparent'">
                                    <span class="flex items-center gap-2">
                                        <span class="truncate">{{ $cat->name }}</span>
                                    </span>
                                    @if(isset($categorySkillsMap[$cat->slug]))
                                    <span class="text-[10px] text-gray-400 font-mono">({{ count($categorySkillsMap[$cat->slug]) }})</span>
                                    @endif
                                </button>
                                @endforeach
                            </div>
                        </div>

                        <!-- Skills Filter (Dynamically changes based on selected category) -->
                        <div class="pt-3 border-t border-gray-100">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">{{ __('Bacarıqlar') }}</h4>
                                <span class="text-[10px] text-gray-400 font-medium" x-text="filteredSkills.length + ' {{ __('bacarıq') }}'"></span>
                            </div>

                            <!-- Skills list -->
                            <div class="space-y-1 text-xs max-h-60 overflow-y-auto pr-1">
                                <template x-for="sk in filteredSkills" :key="sk.name">
                                    <label class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none"
                                           :class="isSkillSelected(sk.name) ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                        <input type="checkbox"
                                               :value="sk.name"
                                               :checked="isSkillSelected(sk.name)"
                                               @change="toggleSkill(sk.name)"
                                               class="sr-only">
                                        <span class="flex items-center gap-2">
                                            <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                                  :class="isSkillSelected(sk.name) ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                                <i class="fas fa-check" x-show="isSkillSelected(sk.name)"></i>
                                            </span>
                                            <span x-text="sk.name"></span>
                                        </span>
                                    </label>
                                </template>

                                <div x-show="filteredSkills.length === 0" x-cloak class="py-3 text-center text-xs text-gray-400">
                                    {{ __('Bu kateqoriyaya aid bacarıq tapılmadı') }}
                                </div>
                            </div>
                        </div>

                        <!-- City Filter -->
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Şəhər') }}</h4>
                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                @foreach($cities as $c)
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none"
                                       :class="city.includes('{{ addslashes($c) }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                    <input type="checkbox"
                                           value="{{ $c }}"
                                           :checked="city.includes('{{ addslashes($c) }}')"
                                           @change="toggleCity('{{ addslashes($c) }}')"
                                           class="sr-only">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                              :class="city.includes('{{ addslashes($c) }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                            <i class="fas fa-check" x-show="city.includes('{{ addslashes($c) }}')"></i>
                                        </span>
                                        <span>{{ $c }}</span>
                                    </span>
                                    <span class="text-[10px] text-gray-400 font-mono"
                                          x-show="getCityCount('{{ addslashes($c) }}', {{ $cityCounts[$c] ?? 0 }}) > 0"
                                          x-text="'(' + getCityCount('{{ addslashes($c) }}', {{ $cityCounts[$c] ?? 0 }}) + ')'"></span>
                                </label>
                                @endforeach

                                @if(count($cities) > 5)
                                <button type="button" @click="showAll = !showAll"
                                        class="w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:text-primary-dark cursor-pointer">
                                    <i class="fas fa-chevron-down text-[8px] mr-1 transition-transform" :class="showAll ? 'rotate-180' : ''"></i>
                                    <span x-text="showAll ? '{{ __('Daha az göstər') }}' : '{{ __('Daha çox göstər') }} (' + ({{ count($cities) }} - 5) + ')'"></span>
                                </button>
                                @endif
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- List Area -->
            <div class="lg:w-3/4 w-full">

                <!-- List Header (Title + Count + Sorting) -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b border-gray-200">
                    <div>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                            <span>{{ __('CV Bazası') }}</span>
                        </h2>
                        <p class="text-xs text-gray-500 mt-0.5">
                            <span class="font-bold text-primary" x-text="totalCount">{{ $resumes->total() }}</span> {{ __('namizəd CV-si tapıldı') }}
                        </p>
                    </div>

                    <div class="flex items-center gap-2 text-xs">
                        <span class="text-gray-500 hidden sm:inline">{{ __('Sıralama:') }}</span>
                        <select x-model="sort"
                                @change="applyFilters()"
                                class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                            <option value="latest">{{ __('Tarixə görə (yeni)') }}</option>
                            <option value="oldest">{{ __('Tarixə görə (köhnə)') }}</option>
                            <option value="alphabetical">{{ __('Əlifba sırası (A-Z)') }}</option>
                            <option value="alphabetical_desc">{{ __('Əlifba sırası (Z-A)') }}</option>
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
