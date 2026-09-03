@extends('layouts.app')

@section('title', __('CV Bazası') . ' - ' . config('app.full_name'))
@section('meta_description', __('Ən istedadlı mütəxəssislərin CV bazası. Şirkətlər üçün peşəkar namizədləri axtarın və CV-lərini incələyin.'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">

    <!-- Main Content Container -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="{
        mobileFiltersOpen: false,
        selectedCategory: '{{ request('category', '') }}',
        selectedSkills: {{ json_encode((array) request('skills', [])) }},
        categorySkills: {{ json_encode($categorySkillsMap) }},
        allSkills: {{ json_encode($categories->flatMap(fn($c) => $c->skills->where('is_active', true))->map(fn($s) => ['id' => $s->id, 'name' => is_array($s->name) ? ($s->name['az'] ?? reset($s->name)) : $s->name])->unique('name')->values()) }},
        get filteredSkills() {
            if (!this.selectedCategory) {
                return this.allSkills;
            }
            return this.categorySkills[this.selectedCategory] || [];
        },
        selectCategory(slug) {
            this.selectedCategory = slug;
        },
        isSkillSelected(name) {
            return this.selectedSkills.includes(name);
        },
        toggleSkill(name) {
            if (this.selectedSkills.includes(name)) {
                this.selectedSkills = this.selectedSkills.filter(s => s !== name);
            } else {
                this.selectedSkills.push(name);
            }
            this.$nextTick(() => {
                document.getElementById('resumesFilterForm').submit();
            });
        }
    }">

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
                    <form method="GET" action="{{ route('resumes.index') }}" id="resumesFilterForm" class="space-y-5">
                        @if(request('sort'))
                        <input type="hidden" name="sort" value="{{ request('sort') }}">
                        @endif

                        <!-- Filter Top Header -->
                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                            <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <i class="fas fa-filter text-xs text-primary"></i>
                                <span>{{ __('Filtrlər') }}</span>
                            </h3>
                            @if(request()->hasAny(['q', 'skills', 'city']))
                            <a href="{{ route('resumes.index', array_merge(request()->only(['sort']))) }}" 
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
                                       placeholder="{{ __('Vəzifə, ad, bacarıq...') }}" 
                                       onkeydown="if(event.key === 'Enter') this.form.submit()"
                                       class="w-full pl-8 pr-7 py-2 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-xs transition">
                                <i class="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]"></i>
                                @if(request('q'))
                                <a href="{{ route('resumes.index', array_merge(request()->except('q'))) }}" 
                                   class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer">
                                    <i class="fas fa-times"></i>
                                </a>
                                @endif
                            </div>
                        </div>
                        
                        <!-- Hidden Category Input for persistence -->
                        <input type="hidden" name="category" :value="selectedCategory">

                        <!-- Category Selection (Dynamically switches skills below) -->
                        <div class="pt-3 border-t border-gray-100">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">{{ __('Kateqoriya') }}</h4>
                                <button type="button" 
                                        x-show="selectedCategory !== ''" 
                                        @click="selectCategory('')" 
                                        class="text-[10px] text-primary font-bold hover:underline cursor-pointer">
                                    {{ __('Bütün kateqoriyalar') }}
                                </button>
                            </div>

                            <div class="space-y-1 text-xs">
                                <button type="button" 
                                        @click="selectCategory('')"
                                        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                        :class="selectedCategory === '' ? 'bg-orange-50 text-primary font-bold border border-orange-200 shadow-2xs' : 'text-gray-600 hover:bg-gray-50 border border-transparent'">
                                    <span class="flex items-center gap-2">
                                        <i class="fas fa-th-large text-[11px]" :class="selectedCategory === '' ? 'text-primary' : 'text-gray-400'"></i>
                                        <span>{{ __('Bütün Sahələr') }}</span>
                                    </span>
                                </button>

                                @foreach($categories as $cat)
                                <button type="button" 
                                        @click="selectCategory('{{ $cat->slug }}')"
                                        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
                                        :class="selectedCategory === '{{ $cat->slug }}' ? 'bg-orange-50 text-primary font-bold border border-orange-200 shadow-2xs' : 'text-gray-600 hover:bg-gray-50 border border-transparent'">
                                    <span class="flex items-center gap-2">
                                        <i class="fas fa-folder text-[11px]" :class="selectedCategory === '{{ $cat->slug }}' ? 'text-primary' : 'text-gray-400'"></i>
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

                            <p class="text-[11px] text-gray-400 mb-2 leading-tight">
                                {{ __('Axtardığınız namizədlərin bacarıqlarını seçin.') }}
                            </p>

                            <!-- Skills list -->
                            <div class="space-y-1 text-xs max-h-60 overflow-y-auto pr-1">
                                <template x-for="sk in filteredSkills" :key="sk.name">
                                    <label class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer select-none"
                                           :class="isSkillSelected(sk.name) ? 'bg-orange-50 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'">
                                        <input type="checkbox" 
                                               name="skills[]" 
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

                                <div x-show="filteredSkills.length === 0" class="py-3 text-center text-xs text-gray-400">
                                    {{ __('Bu kateqoriyaya aid bacarıq tapılmadı') }}
                                </div>
                            </div>
                        </div>
<!-- City Filter -->
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

                    </form>
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
                            <span class="font-bold text-primary">{{ $resumes->total() }}</span> {{ __('namizəd CV-si tapıldı') }}
                        </p>
                    </div>

                    <div class="flex items-center gap-2 text-xs">
                        <span class="text-gray-500 hidden sm:inline">{{ __('Sıralama:') }}</span>
                        <select name="sort" 
                                form="resumesFilterForm"
                                onchange="document.getElementById('resumesFilterForm').submit()" 
                                class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-hidden focus:border-primary text-gray-700 shadow-2xs cursor-pointer">
                            <option value="latest" @selected(request('sort') === 'latest')>{{ __('Tarixə görə (yeni)') }}</option>
                            <option value="alphabetical" @selected(request('sort') === 'alphabetical')>{{ __('Əlifba sırası (A-Z)') }}</option>
                        </select>
                    </div>
                </div>

                <!-- Selected skills banner -->
                @php
                    $activeSkills = (array) request('skills', []);
                @endphp
                @if(!empty($activeSkills))
                <div class="bg-orange-50/70 border border-orange-100 rounded-xl p-3.5 mb-5 flex items-center justify-between gap-3">
                    <div>
                        <span class="text-xs text-orange-950 font-bold uppercase tracking-wider block mb-1">{{ __('Seçilmiş bacarıqlar:') }}</span>
                        <div class="flex flex-wrap gap-1.5">
                            @foreach($activeSkills as $ask)
                            <span class="text-xs font-semibold text-orange-900 bg-white/80 px-2 py-0.5 rounded border border-orange-200/60 inline-flex items-center gap-1.5">
                                <span>{{ $ask }}</span>
                                <button type="button" @click="toggleSkill('{{ $ask }}')" class="text-orange-400 hover:text-orange-700 cursor-pointer text-[10px]">✕</button>
                            </span>
                            @endforeach
                        </div>
                    </div>
                    <a href="{{ route('resumes.index', array_merge(request()->only(['sort', 'category', 'city']))) }}"
                       class="text-xs text-primary font-bold hover:underline cursor-pointer shrink-0">
                        {{ __('Təmizlə') }}
                    </a>
                </div>
                @endif

                <!-- Resumes Grid (3 cards per row) -->
                @if($resumes->count() > 0)
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    @foreach($resumes as $resume)
                    <div class="bg-white rounded-2xl p-5 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between relative cursor-pointer">

                        <div>
                            <!-- Top: Avatar + Name, Position & Location side by side -->
                            <div class="flex items-start gap-3.5">
                                <div class="w-13 h-13 rounded-xl bg-slate-900 border border-gray-100 flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-2xs overflow-hidden">
                                    @if($resume->photo)
                                    <img src="{{ asset('storage/' . $resume->photo) }}" alt="{{ $resume->full_name }}" class="w-full h-full object-cover">
                                    @else
                                    {{ mb_substr($resume->first_name ?: 'C', 0, 1) }}{{ mb_substr($resume->last_name ?: 'V', 0, 1) }}
                                    @endif
                                </div>

                                <div class="min-w-0 flex-1">
                                    <h3 class="text-base font-bold text-gray-900 group-hover:text-primary transition leading-tight truncate">
                                        <a href="{{ route('resumes.show', $resume->id) }}" target="_blank" class="focus:outline-hidden before:absolute before:inset-0">
                                            {{ $resume->title ?: __('Mütəxəssis') }}
                                        </a>
                                    </h3>

                                    <p class="text-xs font-semibold text-primary truncate mt-1">
                                        {{ $resume->full_name }}
                                    </p>
                                </div>
                            </div>

                            <!-- Skills Tags -->
                            <div class="flex flex-wrap items-center gap-1.5 mt-3.5">
                                @if(!empty($resume->skills) && is_array($resume->skills))
                                    @php
                                        $skillList = array_slice($resume->skills, 0, 3);
                                    @endphp
                                    @foreach($skillList as $skItem)
                                    @php
                                        $skTitle = is_array($skItem) ? ($skItem['skill'] ?? '') : $skItem;
                                    @endphp
                                    @if($skTitle)
                                    <span class="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium">
                                        {{ $skTitle }}
                                    </span>
                                    @endif
                                    @endforeach
                                    @if(count($resume->skills) > 3)
                                    <span class="text-[10px] text-gray-400 font-mono">+{{ count($resume->skills) - 3 }}</span>
                                    @endif
                                @endif
                            </div>
                        </div>

                        <!-- Card Bottom: Date & View CTA -->
                        <div class="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span class="text-[11px] text-gray-400 flex items-center gap-1">
                                <i class="far fa-clock text-[10px]"></i>
                                <span>{{ $resume->updated_at ? $resume->updated_at->diffForHumans() : '' }}</span>
                            </span>

                            <span class="text-primary group-hover:text-primary-dark font-bold flex items-center gap-1 transition text-xs">
                                <span>{{ __('CV-yə bax') }}</span>
                                <i class="fas fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                            </span>
                        </div>

                    </div>
                    @endforeach
                </div>

                <!-- Pagination -->
                <div class="mt-8 pagination-wrapper">
                    {{ $resumes->links() }}
                </div>

                @else
                <!-- Empty State -->
                <div class="text-center py-16 bg-white rounded-xl border border-gray-200 p-8 shadow-2xs">
                    <div class="w-14 h-14 bg-orange-50 text-primary rounded-xl flex items-center justify-center mx-auto mb-3 border border-orange-100">
                        <i class="fas fa-file-alt text-xl"></i>
                    </div>
                    <h3 class="text-base font-bold text-gray-900 mb-1">{{ __('Axtarışa uyğun CV tapılmadı') }}</h3>
                    <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                        {{ __('Axtarış meyarlarını dəyişərək və ya filtrləri sıfırlayaraq yenidən cəhd edə bilərsiniz.') }}
                    </p>
                    <a href="{{ route('resumes.index') }}"
                       class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
                        <i class="fas fa-sync-alt text-xs"></i>
                        <span>{{ __('Bütün filtrləri sıfırla') }}</span>
                    </a>
                </div>
                @endif

            </div>

        </div>
    </div>
</div>
@endsection
