@extends('layouts.app')

@section('title', __('İş Axtaranlar') . ' - ' . config('app.full_name'))
@section('meta_description', __('İş axtaranların elanları və CV bazası. Şirkətlər burada istedadlı namizədləri kəşf edib birbaşa əlaqə saxlaya bilər.'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">

    <!-- Main Content Container -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="{ mobileFiltersOpen: false }">

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
                    <form method="GET" action="{{ route('job-seekers.index') }}" id="jobSeekersFilterForm" class="space-y-5">
                        @if(request('sort'))
                        <input type="hidden" name="sort" value="{{ request('sort') }}">
                        @endif

                        <!-- Filter Top Header -->
                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                            <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <i class="fas fa-filter text-xs text-primary"></i>
                                <span>{{ __('Filtrlər') }}</span>
                            </h3>
                            @if(request()->hasAny(['q', 'category', 'job_type', 'type', 'workplace_type', 'experience_level', 'city']))
                            <a href="{{ route('job-seekers.index', array_merge(request()->only(['sort']))) }}" 
                               class="text-xs text-primary hover:text-primary-dark font-medium transition cursor-pointer">
                                {{ __('Təmizlə') }}
                            </a>
                            @endif
                        </div>

                        <!-- Search Input in Sidebar -->
                        <div>
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">{{ __('Axtarış') }}</h4>
                            <div class="relative">
                                <input type="text" 
                                       name="q" 
                                       value="{{ request('q') }}"
                                       placeholder="{{ __('Vəzifə, bacarıq, ad...') }}" 
                                       onkeydown="if(event.key === 'Enter') this.form.submit()"
                                       class="w-full pl-8 pr-7 py-2 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-xs transition">
                                <i class="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]"></i>
                                @if(request('q'))
                                <a href="{{ route('job-seekers.index', array_merge(request()->except('q'))) }}" 
                                   class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer">
                                    <i class="fas fa-times"></i>
                                </a>
                                @endif
                            </div>
                        </div>

                        <!-- Categories & Subcategories -->
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Kateqoriyalar') }}</h4>

                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                <!-- All Categories Option -->
                                <a href="{{ route('job-seekers.index', array_merge(request()->except(['category', 'page']))) }}"
                                   class="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition text-left cursor-pointer {{ !request('category') ? 'bg-primary text-white font-semibold shadow-xs' : 'text-gray-600 hover:bg-gray-50' }}">
                                    <i class="fas fa-th-large text-[10px]"></i>
                                    <span>{{ __('Bütün kateqoriyalar') }}</span>
                                </a>

                                <!-- Category List -->
                                @foreach($categories as $cat)
                                <div x-show="showAll || {{ $loop->index }} < 5" x-data="{ open: {{ (request('category') === $cat->slug || ($cat->children && in_array(request('category'), $cat->children->pluck('slug')->toArray()))) ? 'true' : 'false' }} }">
                                    <div class="flex items-center justify-between rounded-lg transition group {{ request('category') === $cat->slug ? 'bg-orange-50 text-primary font-bold' : 'text-gray-700 hover:bg-gray-50' }}">
                                        <a href="{{ route('job-seekers.index', array_merge(request()->except(['page']), ['category' => $cat->slug])) }}"
                                           class="flex-1 text-left px-2.5 py-2 truncate cursor-pointer">
                                            <span class="truncate">{{ $cat->name }}</span>
                                        </a>
                                        @if($cat->job_seekers_count > 0)
                                        <span class="text-[10px] text-gray-400 font-mono shrink-0">({{ $cat->job_seekers_count }})</span>
                                        @endif
                                        @if($cat->children->isNotEmpty())
                                        <button type="button"
                                                @click.prevent.stop="open = !open"
                                                class="p-2 pl-1.5 text-gray-400 hover:text-primary transition cursor-pointer">
                                            <i class="fas fa-chevron-down text-[9px] transition-transform duration-200"
                                               :class="open ? 'rotate-180 text-primary' : ''"></i>
                                        </button>
                                        @endif
                                    </div>

                                    @if($cat->children->isNotEmpty())
                                    <div class="pl-4 ml-2.5 border-l border-gray-100 space-y-0.5 mt-0.5"
                                         x-show="open"
                                         x-transition:enter="transition ease-out duration-150"
                                         x-transition:enter-start="opacity-0 -translate-y-1"
                                         x-transition:enter-end="opacity-100 translate-y-0"
                                         x-cloak>
                                        @foreach($cat->children as $child)
                                        <a href="{{ route('job-seekers.index', array_merge(request()->except(['page']), ['category' => $child->slug])) }}"
                                           class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer {{ request('category') === $child->slug ? 'bg-orange-100 text-orange-900 font-bold' : 'text-gray-500 hover:text-primary hover:bg-gray-50' }}">
                                            <span class="truncate">{{ $child->name }}</span>
                                            @if($child->job_seekers_count > 0)
                                            <span class="text-[10px] text-gray-400 font-mono shrink-0 ml-2">({{ $child->job_seekers_count }})</span>
                                            @endif
                                        </a>
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
                                @php
                                    $selectedCities = (array) request('city', []);
                                @endphp
                                @foreach($cities as $c)
                                @php
                                    $isSelected = in_array($c, $selectedCities);
                                    $count = $cityCounts[$c] ?? 0;
                                @endphp
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none {{ $isSelected ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50' }}">
                                    <input type="checkbox" name="city[]" value="{{ $c }}" onchange="this.form.submit()" class="sr-only" @checked($isSelected)>
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] {{ $isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300' }}">
                                            @if($isSelected)
                                            <i class="fas fa-check"></i>
                                            @endif
                                        </span>
                                        <span>{{ $c }}</span>
                                    </span>
                                    @if($count > 0)
                                    <span class="text-[10px] text-gray-400 font-mono">({{ $count }})</span>
                                    @endif
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

                        <!-- Workplace Type (Çalışma Yeri) -->
                        @if($workplaceTypes->count() > 0)
                        <div class="pt-3 border-t border-gray-100">
                            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">{{ __('Çalışma Yeri') }}</h4>
                            <div class="space-y-1 text-xs" x-data="{ showAll: false }">
                                @php
                                    $selectedWorkplaces = (array) request('workplace_type', []);
                                @endphp
                                @foreach($workplaceTypes as $wt)
                                @php
                                    $isSelected = in_array($wt->slug, $selectedWorkplaces);
                                @endphp
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none {{ $isSelected ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50' }}">
                                    <input type="checkbox" name="workplace_type[]" value="{{ $wt->slug }}" onchange="this.form.submit()" class="sr-only" @checked($isSelected)>
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] {{ $isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300' }}">
                                            @if($isSelected)
                                            <i class="fas fa-check"></i>
                                            @endif
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
                                @php
                                    $selectedJobTypes = (array) request('job_type', request('type', []));
                                @endphp
                                @foreach($jobTypes as $jt)
                                @php
                                    $isSelected = in_array($jt->slug, $selectedJobTypes);
                                @endphp
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none {{ $isSelected ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50' }}">
                                    <input type="checkbox" name="job_type[]" value="{{ $jt->slug }}" onchange="this.form.submit()" class="sr-only" @checked($isSelected)>
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] {{ $isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300' }}">
                                            @if($isSelected)
                                            <i class="fas fa-check"></i>
                                            @endif
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
                                @php
                                    $selectedExp = (array) request('experience_level', []);
                                @endphp
                                @foreach($experienceLevels as $el)
                                @php
                                    $isSelected = in_array($el->slug, $selectedExp);
                                @endphp
                                <label x-show="showAll || {{ $loop->index }} < 5"
                                       class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none {{ $isSelected ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50' }}">
                                    <input type="checkbox" name="experience_level[]" value="{{ $el->slug }}" onchange="this.form.submit()" class="sr-only" @checked($isSelected)>
                                    <span class="flex items-center gap-2">
                                        <span class="w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] {{ $isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300' }}">
                                            @if($isSelected)
                                            <i class="fas fa-check"></i>
                                            @endif
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

                    </form>
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
                            <span class="font-bold text-primary">{{ $jobSeekers->total() }}</span> {{ __('namizəd elanı tapıldı') }}
                        </p>
                    </div>

                    <div class="flex items-center gap-2 text-xs">
                        <span class="text-gray-500 hidden sm:inline">{{ __('Sıralama:') }}</span>
                        <select name="sort" 
                                form="jobSeekersFilterForm"
                                onchange="document.getElementById('jobSeekersFilterForm').submit()" 
                                class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                            <option value="latest" @selected(request('sort') === 'latest')>{{ __('Tarixə görə (yeni)') }}</option>
                            <option value="popular" @selected(request('sort') === 'popular')>{{ __('Ən çox baxılan') }}</option>
                            <option value="salary_desc" @selected(request('sort') === 'salary_desc')>{{ __('Maaşa görə (çoxdan aza)') }}</option>
                            <option value="salary_asc" @selected(request('sort') === 'salary_asc')>{{ __('Maaşa görə (azdan çoxa)') }}</option>
                        </select>
                    </div>
                </div>

                <!-- Candidate Cards List -->
                @if($jobSeekers->count() > 0)
                <div class="space-y-3">
                    @foreach($jobSeekers as $seeker)
                    <x-candidate-card :seeker="$seeker" />
                    @endforeach
                </div>

                <!-- Pagination -->
                <div class="mt-8 pagination-wrapper">
                    {{ $jobSeekers->links() }}
                </div>

                @else
                <!-- Empty State -->
                <x-empty-state icon="fa-user-tie" :tight="true"
                               :title="__('Axtarışa uyğun namizəd elanı tapılmadı')"
                               :description="__('Axtarış meyarlarını dəyişərək və ya filtrləri sıfırlayaraq yenidən cəhd edə bilərsiniz.')">
                    @slot('actions')
                    <a href="{{ route('job-seekers.create') }}"
                       class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
                        <i class="fas fa-plus text-xs"></i>
                        <span>{{ __('İlk elanınızı yerləşdirin') }}</span>
                    </a>
                    @endslot
                </x-empty-state>
                @endif

            </div>

        </div>
    </div>
</div>
@endsection
