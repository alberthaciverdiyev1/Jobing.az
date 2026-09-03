@extends('layouts.app')

@section('title', __('Yeni Vakansiya Yerləşdir') . ' - ' . config('app.full_name'))

@section('content')
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
<style>
    .quill-editor .ql-editor { min-height: 160px; font-size: 0.875rem; }
</style>
<div class="bg-gray-50 min-h-screen pb-16">
    
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200 py-10">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {{ __('Yeni Vakansiya Yerləşdir') }}
            </h1>
            <p class="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                {{ __('Elanınızı minlərlə istedadlı namizədə çatdırın və komandanızı peşəkarlarla gücləndirin.') }}
            </p>
        </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        @if ($errors->any())
        <div class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            <div class="font-bold mb-1">Xəta baş verdi:</div>
            <ul class="list-disc pl-5 space-y-1 text-xs">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        @php
            // Determine initial parent/subcategory from the previously submitted value (on validation errors)
            $initialParent = '';
            $initialSub = '';
            $oldCatId = old('category_id');
            if ($oldCatId) {
                $parentOfOld = $categories->first(fn ($p) => $p->children->contains('id', (int) $oldCatId));
                if ($parentOfOld) {
                    $initialParent = (string) $parentOfOld->id;
                    $initialSub = (string) $oldCatId;
                } else {
                    $initialParent = (string) $oldCatId;
                }
            }
        @endphp

        <form action="{{ route('jobs.store') }}" method="POST" class="space-y-6" @submit="syncQuillBeforeSubmit()"
              x-data="{
                applicationType: @js(old('application_type', auth()->check() ? 'internal' : 'email')),
                salaryNegotiable: @js((bool) old('salary_negotiable', false)),
                skillSearch: '',
                selectedSkills: @js((array) old('skills', [])),
                categories: @js($categories->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'children' => $c->children->map(fn ($ch) => ['id' => $ch->id, 'name' => $ch->name])->values(),
                ])->values()),
                parentCat: @js($initialParent),
                subCat: @js($initialSub),
                jobTitle: @js(old('title', '')),
                allSkills: @js($skills->map(fn ($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'category_id' => $s->category_id,
                ])),
                get categorySkills() {
                    if (!this.parentCat) {
                        return [];
                    }
                    return this.allSkills.filter(s => !s.category_id || s.category_id == this.parentCat);
                },
                get filteredSkills() {
                    const list = this.categorySkills;
                    if (!this.skillSearch) {
                        return list;
                    }
                    const q = this.skillSearch.toLowerCase();
                    return list.filter(s => s.name.toLowerCase().includes(q));
                },
                get subcategories() {
                    const p = this.categories.find(c => c.id == this.parentCat);
                    return p ? p.children : [];
                },
                updateParent() {
                    this.subCat = '';
                    const catInput = document.getElementById('category_id');
                    if (catInput) catInput.value = this.parentCat || '';
                },
                updateSubCat() {
                    const catInput = document.getElementById('category_id');
                    if (catInput) catInput.value = this.subCat || this.parentCat || '';
                    if (this.subCat && (!this.jobTitle || this.jobTitle.trim() === '')) {
                        const sub = this.subcategories.find(c => c.id == this.subCat);
                        if (sub && sub.name) {
                            this.jobTitle = sub.name;
                        }
                    }
                },
                syncQuillBeforeSubmit() {
                    ['description', 'requirements'].forEach(id => {
                        const q = window.jobQuillEditors && window.jobQuillEditors[id];
                        const hidden = document.getElementById(id);
                        if (q && hidden) {
                            const text = q.getText().trim();
                            hidden.value = text.length > 0 ? q.root.innerHTML : '';
                        }
                    });
                    const catInput = document.getElementById('category_id');
                    if (catInput) {
                        catInput.value = this.subCat || this.parentCat || catInput.value;
                    }
                }
              }">
            @csrf

            <!-- Section 1: Company Info -->
            <div class="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
                <div class="pb-3 border-b border-gray-100 flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-orange-50 text-primary flex items-center justify-center font-bold text-sm">1</div>
                    <h2 class="font-bold text-gray-900 text-base">{{ __('Şirkət Məlumatları') }}</h2>
                </div>

                @if($authCompany)
                <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
                    <i class="fas fa-building-circle-check mt-0.5"></i>
                    <span>{{ __('Şirkət məlumatlarınız hesabınızdan avtomatik dolduruldu.') }}</span>
                </div>
                @endif

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Şirkət Adı') }} *</label>
                        <input type="text" name="company_name" value="{{ old('company_name', $authCompany->name ?? '') }}" required placeholder="FoxSoft Technology"
                               @if($authCompany) disabled @endif
                               class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Şəhər / Lokasiya') }}</label>
                        <select name="company_location"
                                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white">
                            <option value="">{{ __('Şəhər seçin') }}</option>
                            @foreach($cities as $city)
                            @php($cityName = is_object($city) ? (is_array($city->name) ? ($city->name['az'] ?? reset($city->name)) : $city->name) : $city)
                            @php($cityVal = is_object($city) ? $city->id : $city)
                            <option value="{{ $cityVal }}" {{ (old('company_location', $authCompany->city_id ?? '') == $cityVal || old('company_location') == $cityName) ? 'selected' : '' }}>
                                {{ $cityName }}
                            </option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>

            <!-- Section 2: Vacancy Details -->
            <div class="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
                <div class="pb-3 border-b border-gray-100 flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-orange-50 text-primary flex items-center justify-center font-bold text-sm">2</div>
                    <h2 class="font-bold text-gray-900 text-base">{{ __('Vakansiya Təfərrüatları') }}</h2>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Pozisiya / Vakansiya Adı') }} *</label>
                        <input type="text" name="title" x-model="jobTitle" required placeholder="Məsələn: Senior Laravel Developer" 
                               class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden">
                    </div>

                    <!-- Category & Subcategory Row (Side by Side) -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div :class="subcategories.length > 0 ? '' : 'sm:col-span-2'">
                            <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Kateqoriya') }} *</label>
                            <select x-model="parentCat" @change="updateParent()" required
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white">
                                <option value="">{{ __('Kateqoriya seçin') }}</option>
                                @foreach($categories as $parent)
                                <option value="{{ $parent->id }}">{{ $parent->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Subcategory: sits right next to Kateqoriya in the 2nd column --}}
                        <div x-show="subcategories.length > 0" x-cloak x-transition>
                            <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Alt Kateqoriya') }}</label>
                            <select x-model="subCat" @change="updateSubCat()"
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white">
                                <option value="">{{ __('Alt kateqoriya seçin') }}</option>
                                <template x-for="c in subcategories" :key="c.id">
                                    <option :value="c.id" x-text="c.name"></option>
                                </template>
                            </select>
                        </div>

                        {{-- Final category_id submitted: subcategory if chosen, otherwise the parent --}}
                        <input type="hidden" name="category_id" id="category_id" :value="subCat || parentCat">
                    </div>

                    <!-- Work Attributes Row -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Çalışma Yeri') }} *</label>
                            <select name="workplace_type_id" required class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white">
                                <option value="">{{ __('Çalışma Yeri seçin') }}</option>
                                @foreach($workplaceTypes as $wt)
                                <option value="{{ $wt->id }}" {{ old('workplace_type_id') == $wt->id ? 'selected' : '' }}>
                                    {{ $wt->name }}
                                </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('İş Rejimi') }} *</label>
                            <select name="job_type_id" required class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white">
                                <option value="">{{ __('İş Rejimi seçin') }}</option>
                                @foreach($jobTypes as $jt)
                                <option value="{{ $jt->id }}" {{ old('job_type_id') == $jt->id ? 'selected' : '' }}>
                                    {{ $jt->name }}
                                </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Deneyim Seviyesi') }} *</label>
                            <select name="experience_level_id" required class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white">
                                <option value="">{{ __('Deneyim Seviyesi seçin') }}</option>
                                @foreach($experienceLevels as $el)
                                <option value="{{ $el->id }}" {{ old('experience_level_id') == $el->id ? 'selected' : '' }}>
                                    {{ $el->name }}
                                </option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <!-- Salary Range -->
                    <label class="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition pt-2"
                           :class="salaryNegotiable ? 'border-primary bg-orange-50/60' : 'border-gray-200 hover:border-gray-300'">
                        <input type="checkbox" name="salary_negotiable" value="1" x-model="salaryNegotiable" class="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary">
                        <span class="flex flex-col gap-0.5">
                            <span class="text-xs font-bold text-gray-900">{{ __('Maaş razılaşma yolu ilə') }}</span>
                            <span class="text-[11px] text-gray-500">{{ __('Seçilərsə, maaş namizədlə razılaşma əsasında müəyyən edilir.') }}</span>
                        </span>
                    </label>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Minimum Maaş') }}</label>
                            <input type="number" name="salary_min" value="{{ old('salary_min') }}" placeholder="1500" :disabled="salaryNegotiable"
                                   class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Maksimum Maaş') }}</label>
                            <input type="number" name="salary_max" value="{{ old('salary_max') }}" placeholder="3000" :disabled="salaryNegotiable"
                                   class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Məzənnə (Valyuta)') }}</label>
                            <select name="currency" :disabled="salaryNegotiable" class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed">
                                <option value="AZN" {{ old('currency') == 'AZN' ? 'selected' : '' }}>AZN (₼)</option>
                                <option value="USD" {{ old('currency') == 'USD' ? 'selected' : '' }}>USD ($)</option>
                                <option value="EUR" {{ old('currency') == 'EUR' ? 'selected' : '' }}>EUR (€)</option>
                                <option value="TRY" {{ old('currency') == 'TRY' ? 'selected' : '' }}>TRY (₺)</option>
                            </select>
                            <template x-if="salaryNegotiable">
                                <input type="hidden" name="currency" value="AZN">
                            </template>
                        </div>
                    </div>

                    <div>
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <label class="block text-xs font-bold text-gray-700">
                                {{ __('Tələb olunan Bacarıqlar') }}
                            </label>
                            <span class="text-[11px] text-gray-400">
                                <span x-text="selectedSkills.length" class="font-bold text-primary"></span> {{ __('bacarıq seçilib') }}
                            </span>
                        </div>

                        {{-- Hidden inputs to reliably submit all selectedSkills in form post --}}
                        <template x-for="skill in selectedSkills" :key="skill">
                            <input type="hidden" name="skills[]" :value="skill">
                        </template>

                        <!-- Selected Skills Badges (Shown Above) -->
                        <div x-show="selectedSkills.length > 0" x-cloak x-transition class="mb-3 p-3 rounded-xl bg-orange-50/70 border border-orange-200">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-[11px] font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                                    <i class="fas fa-check-circle text-primary text-xs"></i>
                                    <span>{{ __('Seçilmiş Bacarıqlar') }}</span>
                                    <span class="px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px] font-bold" x-text="selectedSkills.length"></span>
                                </span>
                                <button type="button" 
                                        @click="selectedSkills = []"
                                        class="text-[11px] text-gray-500 hover:text-rose-600 transition font-medium hover:underline cursor-pointer">
                                    {{ __('Hamısını təmizlə') }}
                                </button>
                            </div>
                            <div class="flex flex-wrap gap-1.5">
                                <template x-for="skill in selectedSkills" :key="skill">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-orange-950 text-xs font-semibold shadow-2xs">
                                        <span x-text="skill"></span>
                                        <button type="button" 
                                                @click="selectedSkills = selectedSkills.filter(s => s !== skill)"
                                                class="w-4 h-4 rounded-full hover:bg-orange-100 text-gray-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer"
                                                title="{{ __('Sil') }}">
                                            <i class="fas fa-times text-[9px]"></i>
                                        </button>
                                    </span>
                                </template>
                            </div>
                        </div>

                        <!-- Prompt when no category is selected -->
                        <div x-show="!parentCat" class="text-center py-5 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                            <i class="fas fa-layer-group text-gray-300 text-lg mb-1 block"></i>
                            <p class="text-xs text-gray-500">{{ __('Müvafiq bacarıqları görmək üçün əvvəlcə yuxarıdan Kateqoriya seçin.') }}</p>
                        </div>

                        <!-- Search within skills (Shown when category is selected and has skills) -->
                        <div x-show="parentCat && categorySkills.length > 0" class="mb-3">
                            <div class="relative">
                                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                                <input type="text"
                                       placeholder="{{ __('Bu kateqoriya üzrə bacarıq axtar...') }}"
                                       x-model="skillSearch"
                                       class="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-gray-50/60">
                            </div>
                        </div>

                        <!-- Checkboxes Side by Side (Filtered by Selected Category) -->
                        <div x-show="parentCat && filteredSkills.length > 0"
                             class="flex flex-wrap items-center gap-2 max-h-56 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50/40">
                            <template x-for="sk in filteredSkills" :key="sk.id">
                                <label :class="selectedSkills.includes(sk.name) ? 'bg-orange-50 border-primary text-primary font-bold ring-1 ring-primary' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'"
                                       class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition duration-150 cursor-pointer text-xs select-none shadow-2xs">
                                    <input type="checkbox"
                                           :value="sk.name"
                                           x-model="selectedSkills"
                                           class="w-3.5 h-3.5 rounded text-primary focus:ring-primary border-gray-300 cursor-pointer">
                                    <span x-text="sk.name"></span>
                                </label>
                            </template>
                        </div>

                        <!-- No skills matching search query -->
                        <div x-show="parentCat && categorySkills.length > 0 && filteredSkills.length === 0" class="text-center py-4 px-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                            <p class="text-xs text-gray-400">{{ __('Axtarışa uyğun bacarıq tapılmadı.') }}</p>
                        </div>

                        <!-- Category has no skills assigned yet -->
                        <div x-show="parentCat && categorySkills.length === 0" class="text-center py-5 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                            <p class="text-xs text-gray-400">{{ __('Bu kateqoriyaya aid əlavə edilmiş bacarıq yoxdur.') }}</p>
                        </div>

                        <span class="text-[11px] text-gray-400 mt-1.5 block">
                            {{ __('Müvafiq bacarıqları işarələyin. Seçilən bacarıqlar vakansiya kartında etiket kimi göstəriləcək.') }}
                        </span>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('İş Təsviri & Öhdəliklər') }} *</label>
                        <div id="editor-description" class="quill-editor bg-white rounded-xl border border-gray-200" data-initial="{{ old('description', '') }}"></div>
                        <input type="hidden" name="description" id="description" value="{{ old('description') }}">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Tələblər & Təcrübə') }}</label>
                        <div id="editor-requirements" class="quill-editor bg-white rounded-xl border border-gray-200" data-initial="{{ old('requirements', '') }}"></div>
                        <input type="hidden" name="requirements" id="requirements" value="{{ old('requirements') }}">
                    </div>


                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">{{ __('Son Müraciət Tarixi') }}</label>
                        <input type="date" name="deadline" 
                               value="{{ old('deadline', now()->addMonth()->format('Y-m-d')) }}" 
                               min="{{ now()->addDay()->format('Y-m-d') }}"
                               class="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white cursor-pointer">
                    </div>
                </div>
            </div>

            <!-- Section 3: Application Type -->
            <div class="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
                <div class="pb-3 border-b border-gray-100 flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-orange-50 text-primary flex items-center justify-center font-bold text-sm">3</div>
                    <h2 class="font-bold text-gray-900 text-base">{{ __('Müraciət Növü') }}</h2>
                </div>

                <p class="text-xs text-gray-500 -mt-1">{{ __('Namizədlərin müraciətlərini necə qəbul etmək istədiyinizi seçin.') }}</p>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {{-- Internal (CV upload to platform) --}}
                    @if(auth()->check())
                    <label :class="applicationType === 'internal' ? 'border-primary bg-orange-50/60 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'"
                           class="cursor-pointer rounded-2xl border p-4 transition flex flex-col gap-1.5">
                        <input type="radio" name="application_type" value="internal" x-model="applicationType" class="sr-only">
                        <div class="flex items-center justify-between">
                            <i class="fas fa-cloud-arrow-up text-primary text-lg"></i>
                            <span :class="applicationType === 'internal' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'"
                                  class="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center text-[8px]">
                                <i class="fas fa-check" x-show="applicationType === 'internal'"></i>
                            </span>
                        </div>
                        <span class="font-bold text-gray-900 text-xs mt-1">{{ __('CV ilə (Daxili)') }}</span>
                        <span class="text-[11px] text-gray-500 leading-relaxed">{{ __('Namizədlər platformada CV yükləyir. Müraciətlər panelinizə düşür.') }}</span>
                    </label>
                    @else
                    <div class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-4 flex flex-col gap-1.5 opacity-60 cursor-not-allowed select-none relative">
                        <div class="flex items-center justify-between">
                            <i class="fas fa-cloud-arrow-up text-gray-400 text-lg"></i>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <i class="fas fa-lock text-[8px]"></i>
                                {{ __('Giriş tələb olunur') }}
                            </span>
                        </div>
                        <span class="font-bold text-gray-500 text-xs mt-1">{{ __('CV ilə (Daxili)') }}</span>
                        <span class="text-[11px] text-gray-400 leading-relaxed">{{ __('Platforma daxili CV qəbulu üçün şirkət hesabına daxil olmalısınız.') }}</span>
                    </div>
                    @endif

                    {{-- Email --}}
                    <label :class="applicationType === 'email' ? 'border-primary bg-orange-50/60 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'"
                           class="cursor-pointer rounded-2xl border p-4 transition flex flex-col gap-1.5">
                        <input type="radio" name="application_type" value="email" x-model="applicationType" class="sr-only">
                        <div class="flex items-center justify-between">
                            <i class="fas fa-envelope text-primary text-lg"></i>
                            <span :class="applicationType === 'email' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'"
                                  class="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center text-[8px]">
                                <i class="fas fa-check" x-show="applicationType === 'email'"></i>
                            </span>
                        </div>
                        <span class="font-bold text-gray-900 text-xs mt-1">{{ __('E-Posta ilə') }}</span>
                        <span class="text-[11px] text-gray-500 leading-relaxed">{{ __('Namizədlər birbaşa sizin e-poçt ünvanınıza müraciət göndərir.') }}</span>
                    </label>

                    {{-- Both --}}
                    @if(auth()->check())
                    <label :class="applicationType === 'both' ? 'border-primary bg-orange-50/60 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'"
                           class="cursor-pointer rounded-2xl border p-4 transition flex flex-col gap-1.5">
                        <input type="radio" name="application_type" value="both" x-model="applicationType" class="sr-only">
                        <div class="flex items-center justify-between">
                            <i class="fas fa-layer-group text-primary text-lg"></i>
                            <span :class="applicationType === 'both' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'"
                                  class="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center text-[8px]">
                                <i class="fas fa-check" x-show="applicationType === 'both'"></i>
                            </span>
                        </div>
                        <span class="font-bold text-gray-900 text-xs mt-1">{{ __('Hər İkisi') }}</span>
                        <span class="text-[11px] text-gray-500 leading-relaxed">{{ __('Namizədlər istər CV yükləyə, istərsə də e-poçt ilə müraciət edə bilər.') }}</span>
                    </label>
                    @else
                    <div class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-4 flex flex-col gap-1.5 opacity-60 cursor-not-allowed select-none relative">
                        <div class="flex items-center justify-between">
                            <i class="fas fa-layer-group text-gray-400 text-lg"></i>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <i class="fas fa-lock text-[8px]"></i>
                                {{ __('Giriş tələb olunur') }}
                            </span>
                        </div>
                        <span class="font-bold text-gray-500 text-xs mt-1">{{ __('Hər İkisi') }}</span>
                        <span class="text-[11px] text-gray-400 leading-relaxed">{{ __('Platforma daxili idarəetmə üçün şirkət hesabına daxil olmalısınız.') }}</span>
                    </div>
                    @endif
                </div>

                @guest
                <div class="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-info-circle text-blue-500 text-sm shrink-0"></i>
                        <span>{{ __('Giriş etmədiyiniz üçün müraciətlər yalnız e-poçt vasitəsilə qəbul ediləcək. Müraciətləri panelinizdə idarə etmək üçün şirkət hesabınıza daxil ola bilərsiniz.') }}</span>
                    </div>
                    <a href="{{ url('/admin/login') }}" class="shrink-0 font-bold text-primary hover:underline flex items-center gap-1 text-xs">
                        <span>{{ __('Daxil ol') }}</span>
                        <i class="fas fa-arrow-right text-[10px]"></i>
                    </a>
                </div>
                @endguest

                {{-- Email input (shown when email or both is selected) --}}
                <div x-show="applicationType === 'email' || applicationType === 'both'" x-cloak
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 translate-y-1"
                     x-transition:enter-end="opacity-100 translate-y-0"
                     class="pt-2">
                    <label class="block text-xs font-bold text-gray-700 mb-1">
                        {{ __('Müraciət Qəbul Ediləcək E-Posta Adresi') }} 
                        @guest * @endguest
                    </label>
                    <input type="email" name="application_email"
                           value="{{ old('application_email', $authCompany->email ?? '') }}"
                           placeholder="hr@company.com"
                           @guest required @endguest
                           class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden">
                    <p class="text-[11px] text-gray-400 mt-1">
                        @auth
                        {{ __('Boş buraxsanız, şirkət profilinizdəki rəsmi e-poçt ünvanı istifadə olunacaq.') }}
                        @else
                        {{ __('Namizədlərin müraciətləri və CV-ləri birbaşa bu e-poçt ünvanına göndəriləcək.') }}
                        @endauth
                    </p>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
                <button type="submit" class="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-orange-500/30 transition duration-200 cursor-pointer">
                    {{ __('Vakansiyanı Dərc Et') }}
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script>
(function () {
    const fields = [
        { editorId: 'editor-description', hiddenId: 'description' },
        { editorId: 'editor-requirements', hiddenId: 'requirements' },
    ];

    window.jobQuillEditors = window.jobQuillEditors || {};

    function initEditors() {
        fields.forEach(function (f) {
            const container = document.getElementById(f.editorId);
            if (!container || typeof Quill === 'undefined') return;
            if (container.__quill_initialized) return;
            container.__quill_initialized = true;

            const quill = new Quill(container, {
                theme: 'snow',
                placeholder: 'Məzmunu bura yazın...',
            });

            // Restore previously entered content (e.g. on validation errors)
            const initial = container.dataset.initial || '';
            const hidden = document.getElementById(f.hiddenId);
            if (initial) {
                try {
                    quill.clipboard.dangerouslyPasteHTML(initial);
                } catch (e) {
                    quill.setText(initial);
                }
                if (hidden) hidden.value = initial;
            }

            // Sync on EVERY keystroke/text-change
            quill.on('text-change', function () {
                if (hidden) {
                    const text = quill.getText().trim();
                    hidden.value = text.length > 0 ? quill.root.innerHTML : '';
                }
            });

            window.jobQuillEditors[f.hiddenId] = quill;
        });

        const form = document.querySelector('form[action*="jobs"]');
        if (form && !form.__quill_submit_bound) {
            form.__quill_submit_bound = true;
            form.addEventListener('submit', function () {
                fields.forEach(function (f) {
                    const q = window.jobQuillEditors[f.hiddenId];
                    const hidden = document.getElementById(f.hiddenId);
                    if (q && hidden) {
                        const text = q.getText().trim();
                        hidden.value = text.length > 0 ? q.root.innerHTML : '';
                    }
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditors);
    } else {
        initEditors();
    }
})();
</script>
@endpush
