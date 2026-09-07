@extends('layouts.app')

@section('title', __('İş Axtaranlar') . ' - ' . config('app.full_name'))
@section('meta_description', __('İş axtaranların elanları və CV bazası. Şirkətlər burada istedadlı namizədləri kəşf edib birbaşa əlaqə saxlaya bilər.'))

@section('content')
<script>
window.__JOB_SEEKERS_CONFIG__ = {
    initialQuery: @json(request('q', '')),
    initialMinSalary: @json(request('min_salary', '')),
    initialMaxSalary: @json(request('max_salary', '')),
    initialCategory: @json(array_values((array) request('category', []))),
    initialCity: @json(array_values((array) request('city', []))),
    initialWorkplaceType: @json(array_values((array) request('workplace_type', []))),
    initialJobType: @json(array_values((array) request('job_type', request('type', [])))),
    initialExperienceLevel: @json(array_values((array) request('experience_level', []))),
    initialSort: @json(request('sort', 'latest')),
    initialTotal: {{ (int) $jobSeekers->total() }},
    initialCityCounts: @json($cityCounts),
    categoryChildrenMap: @json($categoryChildrenMap),
    activeParentCategories: @json($activeParentCategories)
};
</script>

<div class="bg-gray-50 min-h-screen pb-16">

    <!-- Main Content Container -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="jobSeekersManager()">

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
                                       placeholder="{{ __('Vəzifə, bacarıq, ad...') }}"
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

                        <!-- Categories & Subcategories -->
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Kateqoriyalar') }}</h4>

                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                <!-- All Categories Option -->
                                <button type="button"
                                        @click="clearCategories()"
                                        class="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition text-left cursor-pointer"
                                        :class="category.length === 0 ? 'bg-orange-50 text-primary font-bold border border-orange-200 shadow-2xs' : 'text-gray-600 hover:bg-gray-50 border border-transparent'">
                                    <span>{{ __('Bütün kateqoriyalar') }}</span>
                                </button>

                                <!-- Category List -->
                                @foreach($categories as $cat)
                                <div x-show="showAll || {{ $loop->index }} < 5">
                                    <div class="flex items-center justify-between rounded-lg transition group"
                                         :class="isCategoryActive('{{ $cat->slug }}') ? 'bg-orange-50 text-primary font-bold border border-orange-200 shadow-2xs' : 'text-gray-700 hover:bg-gray-50 border border-transparent'">
                                        <button type="button"
                                                @click="toggleCategory('{{ $cat->slug }}')"
                                                class="flex-1 text-left px-2.5 py-2 truncate cursor-pointer flex items-center justify-between">
                                            <span class="truncate">{{ $cat->name }}</span>
                                            @if($cat->job_seekers_count > 0)
                                            <span class="text-[10px] text-gray-400 font-mono shrink-0 ml-1">({{ $cat->job_seekers_count }})</span>
                                            @endif
                                        </button>
                                        @if($cat->children->isNotEmpty())
                                        <button type="button"
                                                @click.prevent.stop="toggleAccordion('{{ $cat->slug }}')"
                                                class="p-2 pl-1.5 text-gray-400 hover:text-primary transition cursor-pointer">
                                            <i class="fas fa-chevron-down text-[9px] transition-transform duration-200"
                                               :class="isAccordionOpen('{{ $cat->slug }}') ? 'rotate-180 text-primary' : ''"></i>
                                        </button>
                                        @endif
                                    </div>

                                    @if($cat->children->isNotEmpty())
                                    <div class="pl-4 ml-2.5 border-l border-gray-100 space-y-0.5 mt-0.5"
                                         x-show="isAccordionOpen('{{ $cat->slug }}')"
                                         x-transition:enter="transition ease-out duration-150"
                                         x-transition:enter-start="opacity-0 -translate-y-1"
                                         x-transition:enter-end="opacity-100 translate-y-0"
                                         x-cloak>
                                        @foreach($cat->children as $child)
                                        <button type="button"
                                                @click="toggleCategory('{{ $child->slug }}', '{{ $cat->slug }}')"
                                                class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                                :class="isCategoryActive('{{ $child->slug }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:text-primary hover:bg-gray-50'">
                                            <span class="flex items-center gap-2 truncate">
                                                <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] shrink-0"
                                                      :class="isCategoryActive('{{ $child->slug }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                                    <i class="fas fa-check" x-show="isCategoryActive('{{ $child->slug }}')"></i>
                                                </span>
                                                <span class="truncate">{{ $child->name }}</span>
                                            </span>
                                            @if($child->job_seekers_count > 0)
                                            <span class="text-[10px] text-gray-400 font-mono shrink-0 ml-2">({{ $child->job_seekers_count }})</span>
                                            @endif
                                        </button>
                                        @endforeach
                                    </div>
                                    @endif
                                </div>
                                @endforeach

                                @if($categories->count() > 5)
                                <button type="button" @click="showAll = !showAll"
                                        class="w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:text-primary-dark cursor-pointer">
                                    <i class="fas fa-chevron-down text-[8px] mr-1 transition-transform" :class="showAll ? 'rotate-180' : ''"></i>
                                    <span x-text="showAll ? '{{ __('Daha az göstər') }}' : '{{ __('Daha çox göstər') }} (' + ({{ $categories->count() }} - 5) + ')'"></span>
                                </button>
                                @endif
                            </div>
                        </div>

                        <!-- Salary (Gözlənilən Maaş) -->
                        <div class="pt-3 border-t border-gray-100">
                            <div class="flex items-center justify-between mb-2.5">
                                <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">{{ __('Maaş (AZN)') }}</h4>
                                <button type="button"
                                        x-show="minSalary || maxSalary"
                                        x-cloak
                                        @click="minSalary = ''; maxSalary = ''; applyFilters()"
                                        class="text-[11px] text-primary hover:text-primary-dark font-medium transition cursor-pointer">
                                    {{ __('Sıfırla') }}
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="relative">
                                    <input type="number"
                                           x-model="minSalary"
                                           @input.debounce.500ms="applyFilters()"
                                           @keydown.enter.prevent="applyFilters()"
                                           placeholder="{{ __('Min') }}"
                                           min="0"
                                           class="w-full pl-6 pr-2 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-xs transition">
                                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₼</span>
                                </div>
                                <div class="relative">
                                    <input type="number"
                                           x-model="maxSalary"
                                           @input.debounce.500ms="applyFilters()"
                                           @keydown.enter.prevent="applyFilters()"
                                           placeholder="{{ __('Maks') }}"
                                           min="0"
                                           class="w-full pl-6 pr-2 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-xs transition">
                                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₼</span>
                                </div>
                            </div>
                        </div>

                        <!-- City (Şəhər) -->
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Şəhər') }}</h4>
                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                @foreach($cities as $c)
                                <button type="button"
                                        @click="toggleCity('{{ addslashes($c) }}')"
                                        x-show="showAll || {{ $loop->index }} < 5"
                                        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                        :class="isFilterSelected('city', '{{ addslashes($c) }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px]"
                                              :class="isFilterSelected('city', '{{ addslashes($c) }}') ? 'border-primary bg-primary text-white' : 'border-gray-300'">
                                            <i class="fas fa-check" x-show="isFilterSelected('city', '{{ addslashes($c) }}')"></i>
                                        </span>
                                        <span>{{ $c }}</span>
                                    </span>
                                    <span class="text-[10px] text-gray-400 font-mono"
                                          x-show="getCityCount('{{ addslashes($c) }}', {{ $cityCounts[$c] ?? 0 }}) > 0"
                                          x-text="'(' + getCityCount('{{ addslashes($c) }}', {{ $cityCounts[$c] ?? 0 }}) + ')'"></span>
                                </button>
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

                        <!-- Workplace Type (Çalışma Yeri) -->
                        @if($workplaceTypes->count() > 0)
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Çalışma Yeri') }}</h4>
                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                @foreach($workplaceTypes as $wt)
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none"
                                       :class="isFilterSelected('workplaceType', '{{ $wt->slug }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                    <input type="checkbox"
                                           value="{{ $wt->slug }}"
                                           :checked="isFilterSelected('workplaceType', '{{ $wt->slug }}')"
                                           @change="toggleFilter('workplaceType', '{{ $wt->slug }}')"
                                           class="sr-only">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                              :class="isFilterSelected('workplaceType', '{{ $wt->slug }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                            <i class="fas fa-check" x-show="isFilterSelected('workplaceType', '{{ $wt->slug }}')"></i>
                                        </span>
                                        <span>{{ $wt->name }}</span>
                                    </span>
                                    @if($wt->job_seekers_count > 0)
                                    <span class="text-[10px] text-gray-400 font-mono">({{ $wt->job_seekers_count }})</span>
                                    @endif
                                </label>
                                @endforeach

                                @if($workplaceTypes->count() > 5)
                                <button type="button" @click="showAll = !showAll"
                                        class="w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:text-primary-dark cursor-pointer">
                                    <i class="fas fa-chevron-down text-[8px] mr-1 transition-transform" :class="showAll ? 'rotate-180' : ''"></i>
                                    <span x-text="showAll ? '{{ __('Daha az göstər') }}' : '{{ __('Daha çox göstər') }} (' + ({{ $workplaceTypes->count() }} - 5) + ')'"></span>
                                </button>
                                @endif
                            </div>
                        </div>
                        @endif

                        <!-- Job Type (İş Rejimi) -->
                        @if($jobTypes->count() > 0)
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('İş Rejimi') }}</h4>
                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                @foreach($jobTypes as $jt)
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none"
                                       :class="isFilterSelected('jobType', '{{ $jt->slug }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                    <input type="checkbox"
                                           value="{{ $jt->slug }}"
                                           :checked="isFilterSelected('jobType', '{{ $jt->slug }}')"
                                           @change="toggleFilter('jobType', '{{ $jt->slug }}')"
                                           class="sr-only">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                              :class="isFilterSelected('jobType', '{{ $jt->slug }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                            <i class="fas fa-check" x-show="isFilterSelected('jobType', '{{ $jt->slug }}')"></i>
                                        </span>
                                        <span>{{ $jt->name }}</span>
                                    </span>
                                    @if($jt->job_seekers_count > 0)
                                    <span class="text-[10px] text-gray-400 font-mono">({{ $jt->job_seekers_count }})</span>
                                    @endif
                                </label>
                                @endforeach

                                @if($jobTypes->count() > 5)
                                <button type="button" @click="showAll = !showAll"
                                        class="w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:text-primary-dark cursor-pointer">
                                    <i class="fas fa-chevron-down text-[8px] mr-1 transition-transform" :class="showAll ? 'rotate-180' : ''"></i>
                                    <span x-text="showAll ? '{{ __('Daha az göstər') }}' : '{{ __('Daha çox göstər') }} (' + ({{ $jobTypes->count() }} - 5) + ')'"></span>
                                </button>
                                @endif
                            </div>
                        </div>
                        @endif

                        <!-- Experience Level (Təcrübə Səviyyəsi) -->
                        @if($experienceLevels->count() > 0)
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Təcrübə') }}</h4>
                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                @foreach($experienceLevels as $el)
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none"
                                       :class="isFilterSelected('experienceLevel', '{{ $el->slug }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                    <input type="checkbox"
                                           value="{{ $el->slug }}"
                                           :checked="isFilterSelected('experienceLevel', '{{ $el->slug }}')"
                                           @change="toggleFilter('experienceLevel', '{{ $el->slug }}')"
                                           class="sr-only">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                              :class="isFilterSelected('experienceLevel', '{{ $el->slug }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                            <i class="fas fa-check" x-show="isFilterSelected('experienceLevel', '{{ $el->slug }}')"></i>
                                        </span>
                                        <span>{{ $el->name }}</span>
                                    </span>
                                    @if($el->job_seekers_count > 0)
                                    <span class="text-[10px] text-gray-400 font-mono">({{ $el->job_seekers_count }})</span>
                                    @endif
                                </label>
                                @endforeach

                                @if($experienceLevels->count() > 5)
                                <button type="button" @click="showAll = !showAll"
                                        class="w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:text-primary-dark cursor-pointer">
                                    <i class="fas fa-chevron-down text-[8px] mr-1 transition-transform" :class="showAll ? 'rotate-180' : ''"></i>
                                    <span x-text="showAll ? '{{ __('Daha az göstər') }}' : '{{ __('Daha çox göstər') }} (' + ({{ $experienceLevels->count() }} - 5) + ')'"></span>
                                </button>
                                @endif
                            </div>
                        </div>
                        @endif

                    </div>
                </div>
            </div>

            <!-- List Area -->
            <div class="lg:w-3/4 w-full">

                <!-- List Header (Title + Count + Sorting) -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b border-gray-200">
                    <div>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                            <span>{{ __('İş Axtaranlar') }}</span>
                        </h2>
                        <p class="text-xs text-gray-500 mt-0.5">
                            <span class="font-bold text-primary" x-text="totalCount">{{ $jobSeekers->total() }}</span> {{ __('namizəd elanı tapıldı') }}
                        </p>
                    </div>

                    <div class="flex items-center gap-2 text-xs">
                        <span class="text-gray-500 hidden sm:inline">{{ __('Sıralama:') }}</span>
                        <select x-model="sort"
                                @change="applyFilters()"
                                class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                            <option value="latest">{{ __('Tarixə görə (yeni)') }}</option>
                            <option value="oldest">{{ __('Tarixə görə (köhnə)') }}</option>
                            <option value="popular">{{ __('Ən çox baxılan') }}</option>
                            <option value="salary_desc">{{ __('Maaşa görə (çoxdan aza)') }}</option>
                            <option value="salary_asc">{{ __('Maaşa görə (azdan çoxa)') }}</option>
                            <option value="featured">{{ __('Premium elanlar') }}</option>
                            <option value="alphabetical">{{ __('Əlifba sırası (A-Z)') }}</option>
                        </select>
                    </div>
                </div>

                <!-- Candidate Cards Container -->
                <div id="job-seekers-container" class="relative min-h-[300px]" :class="isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-150' : ''">
                    @include('pages.job-seekers.partials.seeker-list', ['jobSeekers' => $jobSeekers])
                </div>

            </div>

        </div>
    </div>
</div>
@endsection
