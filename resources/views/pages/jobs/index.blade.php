@extends('layouts.app')

@section('title', ($selectedCategory?->name ? $selectedCategory->name . ' | ' : '') . __('Vakansiyalar') . ' - ' . config('app.full_name'))
@section('meta_description', $selectedCategory?->name
    ? __('Kategori') . ' ' . $selectedCategory->name . ' — ' . __('bu kateqoriyadakı bütün vakansiyalara baxın və başvurun.')
    : __('Yazılım, tasarım, ürün, veri ve pazarlama alanlarında önde gelen teknoloji şirketlerinin açık pozisyonlarına anında başvurun.'))

@section('content')
<script>
window.__JOBS_CONFIG__ = {
    initialCategory: @json(array_values((array) request('category', []))),
    initialQuery: @json(request('q', '')),
    initialType: @json(array_values((array) request('type', []))),
    initialWorkplace: @json(array_values((array) request('workplace', []))),
    initialExperience: @json(array_values((array) request('experience', []))),
    initialCity: @json(array_values((array) request('city', []))),
    initialSort: @json(request('sort', 'latest')),
    initialTotal: {{ (int) $jobs->total() }},
    activeParentCategory: @json($selectedCategory ? ($selectedCategory->parent_id ? $selectedCategory->parent->slug : $selectedCategory->slug) : ''),
    activeParentCategories: @json($selectedCategories->map(fn ($c) => $c->parent_id ? $c->parent->slug : $c->slug)->values()),
    initialCounts: {
        jobTypes: @json($jobTypes->pluck('vacancies_count', 'slug')),
        workplaceTypes: @json($workplaceTypes->pluck('vacancies_count', 'slug')),
        experienceLevels: @json($experienceLevels->pluck('vacancies_count', 'slug'))
    },
    initialCategoryCounts: @json($categoryCounts)
};
</script>

<div class="bg-gray-50 min-h-screen pb-16" x-data="jobsManager()">

    <!-- Content Grid -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Mobile Filter Trigger -->
        <div class="lg:hidden mb-4">
            <button @click="mobileFiltersOpen = !mobileFiltersOpen" 
                    class="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-between shadow-2xs">
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
                    
                    <!-- Filter Top Header -->
                    <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                        <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <i class="fas fa-filter text-xs text-primary"></i>
                            <span>{{ __('Filtrlər') }}</span>
                        </h3>
                        <button type="button" 
                                x-show="hasActiveFilters" 
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
                                   placeholder="{{ __('Vəzifə və ya şirkət...') }}" 
                                   class="w-full pl-8 pr-7 py-2 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-xs transition">
                            <i class="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]"></i>
                            <button type="button" 
                                    x-show="q" 
                                    @click="q = ''; applyFilters()" 
                                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Categories & Subcategories (collapsed by default, expand on demand) -->
                    <div class="pt-3 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Kateqoriyalar') }}</h4>

                        <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                            <!-- All Categories Option -->
                            <button type="button"
                                    @click="clearCategories()"
                                    class="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition text-left cursor-pointer"
                                    :class="!category.length ? 'bg-primary text-white font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50'">
                                <i class="fas fa-th-large text-[10px]"></i>
                                <span>{{ __('Bütün kateqoriyalar') }}</span>
                            </button>

                            <!-- Category List (parents visible, children collapsed by default) -->
                            @foreach($categories as $cat)
                            <div x-show="showAll || {{ $loop->index }} < 5">
                                <div class="flex items-center justify-between rounded-lg transition group"
                                     :class="category.includes('{{ $cat->slug }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-700 hover:bg-gray-50'">
                                    <button type="button"
                                            @click="toggleCategory('{{ $cat->slug }}')"
                                            class="flex-1 text-left px-2.5 py-2 truncate cursor-pointer"
                                            :aria-expanded="isAccordionOpen('{{ $cat->slug }}')">
                                        <span class="truncate">{{ $cat->name }}</span>
                                    </button>
                                    <span class="text-[10px] text-gray-400 font-mono shrink-0" x-text="getCategoryCount('{{ $cat->slug }}', {{ $cat->vacancies_count }})"></span>
                                    @if($cat->children->isNotEmpty())
                                    <button type="button"
                                            @click.stop="toggleAccordion('{{ $cat->slug }}')"
                                            class="p-2 pl-1.5 text-gray-400 hover:text-primary transition cursor-pointer"
                                            :aria-expanded="isAccordionOpen('{{ $cat->slug }}')">
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
                                            :class="category.includes('{{ $child->slug }}') ? 'bg-orange-100 text-orange-900 font-bold' : 'text-gray-500 hover:text-primary hover:bg-gray-50'">
                                        <span class="truncate">{{ $child->name }}</span>
                                        <span class="text-[10px] text-gray-400 font-mono shrink-0 ml-2">(<span x-text="getCategoryCount('{{ $child->slug }}', {{ $child->vacancies_count }})"></span>)</span>
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

                    <!-- City (Şəhər) -->
                    <div class="pt-3 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Şəhər') }}</h4>
                        <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                            @forelse($cities as $city)
                            @php
                                $citySlug = is_object($city) ? $city->slug : $city;
                                $cityName = is_object($city) ? $city->name : $city;
                            @endphp
                            <button type="button"
                                    @click="toggleFilter('city', @js($citySlug))"
                                    x-show="showAll || {{ $loop->index }} < 5"
                                    class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                    :class="city.includes(@js($citySlug)) ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                <span class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                          :class="city.includes(@js($citySlug)) ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                        <i class="fas fa-check" x-show="city.includes(@js($citySlug))"></i>
                                    </span>
                                    <span>{{ $cityName }}</span>
                                </span>
                                @if(is_object($city) && isset($city->vacancies_count) && $city->vacancies_count > 0)
                                <span class="text-[10px] text-gray-400 font-mono">
                                    ({{ $city->vacancies_count }})
                                </span>
                                @endif
                            </button>
                            @empty
                            <p class="text-[11px] text-gray-400 px-2.5 py-1.5">{{ __('Şəhər mövcud deyil') }}</p>
                            @endforelse

                            @if($cities->count() > 5)
                            <button type="button" @click="showAll = !showAll"
                                    class="w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:text-primary-dark cursor-pointer">
                                <i class="fas fa-chevron-down text-[8px] mr-1 transition-transform" :class="showAll ? 'rotate-180' : ''"></i>
                                <span x-text="showAll ? '{{ __('Daha az göstər') }}' : '{{ __('Daha çox göstər') }} (' + ({{ $cities->count() }} - 5) + ')'"></span>
                            </button>
                            @endif
                        </div>
                    </div>

                    <!-- Work Type (İş rejimi) -->
                    <div class="pt-3 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('İş rejimi') }}</h4>
                        <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                            @foreach($jobTypes as $jt)
                            <button type="button"
                                    @click="toggleFilter('type', '{{ $jt->slug }}')"
                                    x-show="showAll || {{ $loop->index }} < 5"
                                    class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                    :class="type.includes('{{ $jt->slug }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                <span class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                          :class="type.includes('{{ $jt->slug }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                        <i class="fas fa-check" x-show="type.includes('{{ $jt->slug }}')"></i>
                                    </span>
                                    <span>{{ $jt->name }}</span>
                                </span>
                                <span class="text-[10px] text-gray-400 font-mono"
                                      x-show="getCount('jobTypes', '{{ $jt->slug }}', {{ $jt->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('jobTypes', '{{ $jt->slug }}', {{ $jt->vacancies_count }}) + ')'">
                                    ({{ $jt->vacancies_count }})
                                </span>
                            </button>
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

                    <!-- Workplace Type (Çalışma Yeri) -->
                    <div class="pt-3 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Çalışma Yeri') }}</h4>
                        <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                            @foreach($workplaceTypes as $wt)
                            <button type="button"
                                    @click="toggleFilter('workplace', '{{ $wt->slug }}')"
                                    x-show="showAll || {{ $loop->index }} < 5"
                                    class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                    :class="workplace.includes('{{ $wt->slug }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                <span class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                          :class="workplace.includes('{{ $wt->slug }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                        <i class="fas fa-check" x-show="workplace.includes('{{ $wt->slug }}')"></i>
                                    </span>
                                    <span>{{ $wt->name }}</span>
                                </span>
                                <span class="text-[10px] text-gray-400 font-mono"
                                      x-show="getCount('workplaceTypes', '{{ $wt->slug }}', {{ $wt->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('workplaceTypes', '{{ $wt->slug }}', {{ $wt->vacancies_count }}) + ')'">
                                    ({{ $wt->vacancies_count }})
                                </span>
                            </button>
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

                    <!-- Experience Level (Təcrübə Səviyyəsi) -->
                    <div class="pt-3 border-t border-gray-100">
                        <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Deneyim Seviyesi') }}</h4>
                        <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                            @foreach($experienceLevels as $el)
                            <button type="button"
                                    @click="toggleFilter('experience', '{{ $el->slug }}')"
                                    x-show="showAll || {{ $loop->index }} < 5"
                                    class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                    :class="experience.includes('{{ $el->slug }}') ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                <span class="flex items-center gap-2">
                                    <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px]"
                                          :class="experience.includes('{{ $el->slug }}') ? 'bg-primary border-primary text-white' : 'border-gray-300'">
                                        <i class="fas fa-check" x-show="experience.includes('{{ $el->slug }}')"></i>
                                    </span>
                                    <span>{{ $el->name }}</span>
                                </span>
                                <span class="text-[10px] text-gray-400 font-mono"
                                      x-show="getCount('experienceLevels', '{{ $el->slug }}', {{ $el->vacancies_count }}) > 0"
                                      x-text="'(' + getCount('experienceLevels', '{{ $el->slug }}', {{ $el->vacancies_count }}) + ')'">
                                    ({{ $el->vacancies_count }})
                                </span>
                            </button>
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

                </div>
            </div>

            <!-- List Area -->
            <div class="lg:w-3/4 w-full">
                
                <!-- List Header (Title + Count + Sorting) -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b border-gray-200">
                    <div>
                        <h2 class="text-lg md:text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                            <span>{{ __('Vakansiyalar') }}</span>
                            <span x-show="isLoading" class="inline-block animate-spin text-primary text-xs">
                                <i class="fas fa-spinner"></i>
                            </span>
                        </h2>
                        <p class="text-xs text-gray-500 mt-0.5">
                            <span class="font-bold text-primary" x-text="totalCount"></span> {{ __('aktiv iş elanı tapıldı') }}
                        </p>
                    </div>

                    <div class="flex items-center gap-2 text-xs">
                        <span class="text-gray-500 hidden sm:inline">{{ __('Sıralama:') }}</span>
                        <select x-model="sort" 
                                @change="applyFilters()" 
                                class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                            <option value="latest">{{ __('Tarixə görə (yeni)') }}</option>
                            <option value="salary_high">{{ __('Maaşa görə (çoxdan aza)') }}</option>
                            <option value="views">{{ __('Ən çox baxılan') }}</option>
                        </select>
                    </div>
                </div>

                <!-- Async Jobs Container with Loading State -->
                <div id="jobs-container" class="relative min-h-[300px]" :class="isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-150' : ''">
                    @include('pages.jobs.partials.job-list', ['jobs' => $jobs, 'selectedCategory' => $selectedCategory])
                </div>

            </div>

        </div>
    </div>
</div>
@endsection
