@extends('layouts.app')

@section('title', $jobSeeker->title . ' - ' . config('app.full_name'))
@section('meta_description', strip_tags(Str::limit($jobSeeker->description, 150)))

@section('content')
<div x-data="{ bumpModalOpen: false, premiumModalOpen: false }" class="bg-gray-50 min-h-screen pb-16">

    <!-- Top Header -->
    <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Profile Header Info -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6">

                <!-- Left: Candidate Avatar + Title + Meta -->
                <div class="flex items-start sm:items-center gap-4 sm:gap-5">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border border-gray-200 shadow-2xs flex items-center justify-center font-bold text-white text-2xl sm:text-3xl shrink-0">
                        {{ mb_substr($jobSeeker->contact_name, 0, 1) }}
                    </div>

                    <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2 text-xs">
                            <span class="font-bold text-gray-900">{{ $jobSeeker->contact_name }}</span>
                            @if($jobSeeker->position)
                            <span class="text-gray-300">•</span>
                            <span class="text-gray-500 font-medium">{{ $jobSeeker->position }}</span>
                            @endif
                            @if($jobSeeker->category)
                            <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                                {{ $jobSeeker->category->name }}
                            </span>
                            @endif
                            <span class="text-gray-300">•</span>
                            <span class="text-gray-400 text-[11px]">{{ $jobSeeker->created_at->diffForHumans() }}</span>
                        </div>

                        <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            {{ $jobSeeker->title }}
                        </h1>

                        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 pt-0.5">
                            <span class="flex items-center gap-1">
                                <i class="fas fa-map-marker-alt text-gray-400 text-xs"></i>
                                <span>{{ $jobSeeker->location ?: __('Bakı, Azərbaycan') }}</span>
                            </span>
                            @if($jobSeeker->workplaceType)
                            <span class="text-gray-300">•</span>
                            <span>{{ $jobSeeker->workplaceType->name }}</span>
                            @endif
                            @if($jobSeeker->jobType)
                            <span class="text-gray-300">•</span>
                            <span>{{ $jobSeeker->jobType->name }}</span>
                            @endif
                        </div>
                    </div>
                </div>

                <!-- Right: Expected Salary Pill -->
                <div class="shrink-0 self-start md:self-center">
                    <div class="px-5 py-2.5 rounded-xl bg-orange-50/80 border border-orange-100 text-center min-w-[130px] shadow-2xs">
                        <span class="text-lg sm:text-xl font-black text-primary font-mono block leading-tight">{{ $jobSeeker->formatted_salary }}</span>
                        <span class="text-[11px] font-bold text-orange-950 uppercase tracking-wider block mt-0.5">{{ __('Gözlənilən Maaş') }}</span>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <!-- Main Content Area -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Left 2 cols: Details & Skills -->
            <div class="lg:col-span-2 space-y-6">

                <!-- Key Facts Grid -->
                <div class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-2xs grid grid-cols-2 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    <div>
                        <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{{ __('Müsabiqə / Çıxış') }}</span>
                        <span class="text-xs font-bold text-gray-900 mt-1 block">{{ $jobSeeker->availability_label }}</span>
                    </div>
                    <div class="pt-3 sm:pt-0 sm:pl-4">
                        <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{{ __('Təcrübə Səviyyəsi') }}</span>
                        <span class="text-xs font-bold text-gray-900 mt-1 block">{{ $jobSeeker->experienceLevel?->name ?: '—' }}</span>
                    </div>
                    <div class="pt-3 sm:pt-0 sm:pl-4">
                        <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{{ __('Şəhər / Region') }}</span>
                        <span class="text-xs font-bold text-gray-900 mt-1 block">{{ $jobSeeker->location ?: __('Bakı') }}</span>
                    </div>
                </div>

                <!-- Bio & Description Card -->
                <div class="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-6">
                    <div class="space-y-3">
                        <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
                            <span class="w-1.5 h-4 bg-primary rounded-full"></span>
                            <span>{{ __('Təcrübə və Bacarıqlar') }}</span>
                        </h2>
                        <div class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                            {!! nl2br(e($jobSeeker->description)) !!}
                        </div>
                    </div>

                    @if($jobSeeker->skills && count($jobSeeker->skills) > 0)
                    <div class="space-y-3 pt-6 border-t border-gray-100">
                        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ __('Texnologiyalar & Bacarıqlar') }}</h3>
                        <div class="flex flex-wrap gap-2">
                            @foreach($jobSeeker->skills as $skill)
                            <span class="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold font-mono border border-gray-200">
                                {{ $skill }}
                            </span>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <div class="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <span>{{ __('Baxış sayı:') }} <strong class="text-gray-700 font-mono">{{ $jobSeeker->views_count }}</strong></span>
                        <span>{{ __('Elan ID:') }} <strong class="text-gray-700 font-mono">#{{ $jobSeeker->id }}</strong></span>
                    </div>
                </div>

            </div>

            <!-- Right Sidebar: Contact Reveal Card -->
            <div class="space-y-6">
                <div class="bg-white rounded-xl border border-gray-200 shadow-2xs p-5 space-y-4 sticky top-24"
                     x-data="contactReveal('{{ route('contact-reveal.job-seeker', $jobSeeker->id) }}', @js($jobSeeker->contact_phone ? true : false))">

                    <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
                        <i class="fas fa-shield-alt text-primary text-xs"></i>
                        <span>{{ __('Namizədlə Əlaqə') }}</span>
                    </h3>

                    <!-- Blurred / masked state -->
                    <div x-show="!revealed" class="space-y-3">
                        <div class="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center">
                            <p class="text-xs text-gray-500 mb-3">
                                {{ __('Namizədin e-poçt və ya telefon nömrəsini görmək üçün aşağıdakı düyməyə toxunun.') }}
                            </p>
                            <button type="button" @click="reveal()" :disabled="loading"
                                    class="w-full px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                                <i class="fas fa-eye text-xs" x-show="!loading"></i>
                                <i class="fas fa-spinner fa-spin text-xs" x-show="loading" x-cloak></i>
                                <span x-text="loading ? '{{ __('Göstərilir...') }}' : '{{ __('Əlaqə məlumatlarını göstər') }}'"></span>
                            </button>
                        </div>
                    </div>

                    <!-- Revealed state -->
                    <div x-show="revealed" x-cloak class="space-y-3"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0"
                         x-transition:enter-end="opacity-100">
                        <template x-if="email">
                            <a :href="'mailto:' + email"
                               class="w-full px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer">
                                <i class="far fa-envelope text-xs"></i>
                                <span x-text="email"></span>
                            </a>
                        </template>
                        <template x-if="hasPhone">
                            <a :href="'tel:' + phone"
                               class="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-primary hover:text-primary text-gray-800 font-bold text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer">
                                <i class="fas fa-phone text-xs"></i>
                                <span x-text="phone"></span>
                            </a>
                        </template>
                        <p x-show="!email && !hasPhone" class="text-xs text-gray-400 text-center">{{ __('Əlaqə məlumatı qeyd olunmayıb') }}</p>
                    </div>

                    @if($jobSeeker->contact_phone || $jobSeeker->contact_email)
                    <p class="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 pt-1">
                        <i class="fas fa-lock text-[9px]"></i>
                        <span>{{ __('Məlumatlar spamdan qorunmaq üçün gizlədilir.') }}</span>
                    </p>
                    @endif
                </div>

                <!-- Promote JobSeeker Card (İrəli çək & Premium et) -->
                <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-3">
                    <div>
                        <h4 class="font-bold text-gray-900 text-xs uppercase tracking-wider">{{ __('Elanı Tanıt & Fərqləndir') }}</h4>
                        <p class="text-[11px] text-gray-500 mt-0.5">{{ __('Profilinizi şirkətlərin və işəgötürənlərin diqqətinə çatdırın.') }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5 pt-1">
                        <button type="button" @click="bumpModalOpen = true"
                                class="w-full py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-primary font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                            <i class="fas fa-rocket text-[11px]"></i>
                            <span>{{ __('İrəli çək') }}</span>
                        </button>
                        <button type="button" @click="premiumModalOpen = true"
                                class="w-full py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                            <i class="fas fa-crown text-[11px]"></i>
                            <span>{{ __('Premium et') }}</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <!-- Promotion Modals (İrəli çək & Premium et) -->
    <x-promotion-modals type="job_seeker" :title="$jobSeeker->title" :id="$jobSeeker->id" />
</div>
@endsection
