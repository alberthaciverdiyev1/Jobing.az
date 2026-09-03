@extends('layouts.app')

@section('title', $resume->full_name . ' — ' . ($resume->title ?: 'CV') . ' - ' . config('app.full_name'))
@section('meta_description', strip_tags(Str::limit($resume->summary ?: $resume->full_name . ' ' . $resume->title, 150)))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">
    <!-- Candidate Profile Banner -->
    <div class="bg-white border-b border-gray-200 shadow-2xs">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">

                <!-- Left: Avatar + Details -->
                <div class="flex items-start sm:items-center gap-5">
                    <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border-2 border-gray-100 flex items-center justify-center font-bold text-white text-3xl shadow-sm overflow-hidden shrink-0">
                        @if($resume->photo)
                        <img src="{{ asset('storage/' . $resume->photo) }}" alt="{{ $resume->full_name }}" class="w-full h-full object-cover">
                        @else
                        {{ mb_substr($resume->first_name ?: 'C', 0, 1) }}{{ mb_substr($resume->last_name ?: 'V', 0, 1) }}
                        @endif
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex flex-wrap items-center gap-2">
                            <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {{ $resume->full_name }}
                            </h1>
                        </div>

                        <p class="text-sm sm:text-base font-bold text-primary">
                            {{ $resume->title ?: __('Mütəxəssis') }}
                        </p>
                    </div>
                </div>

                <!-- Right: Quick Action Buttons -->
                <div class="flex flex-wrap items-center gap-2.5 shrink-0">
                    @if($resume->whatsapp)
                    <a href="{{ $resume->whatsapp_url }}" target="_blank"
                       class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs">
                        <i class="fab fa-whatsapp text-sm"></i>
                        <span>{{ __('WhatsApp ilə yaz') }}</span>
                    </a>
                    @endif

                    @if($resume->email)
                    <a href="mailto:{{ $resume->email }}"
                       class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs">
                        <i class="far fa-envelope text-xs"></i>
                        <span>{{ __('E-poçt Göndər') }}</span>
                    </a>
                    @endif

                    @if($resume->phone)
                    <a href="tel:{{ $resume->phone }}"
                       class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-primary hover:text-primary bg-white text-gray-800 text-xs font-bold transition shadow-2xs">
                        <i class="fas fa-phone text-xs text-primary"></i>
                        <span>{{ __('Zəng Et') }}</span>
                    </a>
                    @endif
                </div>

            </div>
        </div>
    </div>

    <!-- Main Content Body -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <!-- Left Main Column (Details) -->
            <div class="lg:col-span-8 space-y-6">

                <!-- Professional Summary -->
                @if($resume->summary)
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                    <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i class="fas fa-user-tie text-primary text-xs"></i>
                        <span>{{ __('Haqqında / Peşəkar Xülasə') }}</span>
                    </h3>
                    <div class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {{ $resume->summary }}
                    </div>
                </div>
                @endif

                <!-- Work Experience -->
                @if(!empty($resume->work_experiences) && is_array($resume->work_experiences))
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                    <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <i class="fas fa-briefcase text-primary text-xs"></i>
                        <span>{{ __('İş Təcrübəsi') }}</span>
                    </h3>

                    <div class="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-100">
                        @foreach($resume->work_experiences as $exp)
                        <div class="relative flex items-start gap-4">
                            <!-- Bullet Icon -->
                            <div class="w-7 h-7 rounded-full bg-orange-50 border-2 border-primary text-primary flex items-center justify-center text-[10px] shrink-0 z-10">
                                <i class="fas fa-check"></i>
                            </div>

                            <div class="flex-1 bg-gray-50/70 hover:bg-gray-50 rounded-xl p-4 border border-gray-100 transition">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ $exp['position'] ?? '' }}
                                    </h4>
                                    <span class="text-xs font-mono font-medium text-gray-500">
                                        {{ $exp['start_date'] ?? '' }} — {{ !empty($exp['is_current']) ? __('Hal-hazırda') : ($exp['end_date'] ?? '') }}
                                    </span>
                                </div>

                                <div class="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                                    <i class="far fa-building text-[11px]"></i>
                                    <span>{{ $exp['company'] ?? '' }}</span>
                                    @if(!empty($exp['work_type']))
                                    <span class="text-gray-300">•</span>
                                    <span class="text-gray-500 font-normal capitalize">{{ str_replace('_', ' ', $exp['work_type']) }}</span>
                                    @endif
                                </div>

                                @if(!empty($exp['description']))
                                <div class="text-xs text-gray-600 leading-relaxed whitespace-pre-line pt-1">
                                    {{ $exp['description'] }}
                                </div>
                                @endif
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Education -->
                @if(!empty($resume->education) && is_array($resume->education))
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                    <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <i class="fas fa-graduation-cap text-primary text-xs"></i>
                        <span>{{ __('Təhsil') }}</span>
                    </h3>

                    <div class="space-y-4">
                        @foreach($resume->education as $edu)
                        <div class="flex items-start gap-4 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-sm shrink-0">
                                <i class="fas fa-university"></i>
                            </div>

                            <div class="flex-1 min-w-0">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <h4 class="text-sm font-bold text-gray-900">
                                        {{ $edu['institution'] ?? '' }}
                                    </h4>
                                    <span class="text-xs font-mono text-gray-500">
                                        {{ $edu['start_date'] ?? '' }} — {{ !empty($edu['is_current']) ? __('Davam edir') : ($edu['end_date'] ?? '') }}
                                    </span>
                                </div>

                                <p class="text-xs text-gray-700 font-medium mt-0.5">
                                    <span class="capitalize font-semibold text-primary">{{ $edu['degree'] ?? '' }}</span>
                                    @if(!empty($edu['field_of_study']))
                                    — {{ $edu['field_of_study'] }}
                                    @endif
                                </p>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Projects -->
                @if(!empty($resume->projects) && is_array($resume->projects))
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                    <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <i class="fas fa-laptop-code text-primary text-xs"></i>
                        <span>{{ __('Layihələr') }}</span>
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        @foreach($resume->projects as $proj)
                        @php
                            $hasUrl = !empty($proj['url']);
                            $projUrl = $hasUrl ? (str_starts_with($proj['url'], 'http') ? $proj['url'] : 'https://' . $proj['url']) : null;
                        @endphp

                        @if($hasUrl)
                        <a href="{{ $projUrl }}" target="_blank" rel="noopener noreferrer"
                           class="block p-4 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 space-y-2 group cursor-pointer">
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="text-xs font-bold text-gray-900 group-hover:text-primary transition truncate flex items-center gap-1.5">
                                    <i class="fas fa-folder text-primary/70 text-[11px]"></i>
                                    <span>{{ $proj['title'] ?? '' }}</span>
                                </h4>
                                <span class="text-gray-400 group-hover:text-primary transition shrink-0 text-xs">
                                    <i class="fas fa-arrow-up-right-from-square text-[11px]"></i>
                                </span>
                            </div>
                            @if(!empty($proj['description']))
                            <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                {{ $proj['description'] }}
                            </p>
                            @endif
                            <div class="pt-1 flex items-center gap-1 text-[11px] font-medium text-primary">
                                <span class="truncate max-w-[240px]">{{ str_replace(['https://', 'http://'], '', $proj['url']) }}</span>
                            </div>
                        </a>
                        @else
                        <div class="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-2">
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
                                    <i class="fas fa-folder text-gray-400 text-[11px]"></i>
                                    <span>{{ $proj['title'] ?? '' }}</span>
                                </h4>
                            </div>
                            @if(!empty($proj['description']))
                            <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                {{ $proj['description'] }}
                            </p>
                            @endif
                        </div>
                        @endif
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Certificates & Awards -->
                @if((!empty($resume->certificates) && is_array($resume->certificates)) || (!empty($resume->awards) && is_array($resume->awards)))
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                    <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <i class="fas fa-award text-primary text-xs"></i>
                        <span>{{ __('Sertifikatlar və Mükafatlar') }}</span>
                    </h3>

                    <div class="space-y-3">
                        @if(!empty($resume->certificates))
                            @foreach($resume->certificates as $cert)
                            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100 text-xs">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                                        <i class="fas fa-certificate"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900">{{ $cert['name'] ?? '' }}</h4>
                                        <span class="text-gray-500 text-[11px]">{{ $cert['organization'] ?? '' }}</span>
                                    </div>
                                </div>
                                @if(!empty($cert['issue_date']))
                                <span class="text-gray-400 font-mono text-[11px]">{{ $cert['issue_date'] }}</span>
                                @endif
                            </div>
                            @endforeach
                        @endif

                        @if(!empty($resume->awards))
                            @foreach($resume->awards as $award)
                            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100 text-xs">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                                        <i class="fas fa-trophy"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900">{{ $award['title'] ?? '' }}</h4>
                                        <span class="text-gray-500 text-[11px]">{{ $award['issuer'] ?? '' }}</span>
                                    </div>
                                </div>
                                @if(!empty($award['date']))
                                <span class="text-gray-400 font-mono text-[11px]">{{ $award['date'] }}</span>
                                @endif
                            </div>
                            @endforeach
                        @endif
                    </div>
                </div>
                @endif

                <!-- Volunteer Experiences -->
                @if(!empty($resume->volunteer_experiences) && is_array($resume->volunteer_experiences))
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
                    <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <i class="fas fa-hands-helping text-primary text-xs"></i>
                        <span>{{ __('Könüllülük Fəaliyyəti') }}</span>
                    </h3>

                    <div class="space-y-3">
                        @foreach($resume->volunteer_experiences as $vol)
                        <div class="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h4 class="text-xs font-bold text-gray-900">{{ $vol['role'] ?? '' }}</h4>
                                @if(!empty($vol['start_date']))
                                <span class="text-gray-400 font-mono text-[11px]">{{ $vol['start_date'] }} — {{ !empty($vol['end_date']) ? $vol['end_date'] : __('Davam edir') }}</span>
                                @endif
                            </div>
                            <span class="text-xs font-semibold text-primary block">{{ $vol['organization'] ?? '' }}</span>
                            @if(!empty($vol['description']))
                            <p class="text-xs text-gray-600 leading-relaxed pt-1">
                                {{ $vol['description'] }}
                            </p>
                            @endif
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

            </div>

            <!-- Right Sidebar Column -->
            <div class="lg:col-span-4 space-y-6">

                <!-- Contact Details Card -->
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
                    <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
                        <i class="fas fa-address-card text-primary text-xs"></i>
                        <span>{{ __('Əlaqə Məlumatları') }}</span>
                    </h3>

                    <div class="space-y-3 text-xs">
                        @if($resume->email)
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
                                <i class="far fa-envelope"></i>
                            </div>
                            <div class="min-w-0 flex-1 pt-1">
                                <span class="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">{{ __('E-poçt') }}</span>
                                <a href="mailto:{{ $resume->email }}" class="font-bold text-gray-900 hover:text-primary transition truncate block">{{ $resume->email }}</a>
                            </div>
                        </div>
                        @endif

                        @if($resume->phone)
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="min-w-0 flex-1 pt-1">
                                <span class="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">{{ __('Telefon') }}</span>
                                <a href="tel:{{ $resume->phone }}" class="font-bold text-gray-900 hover:text-primary transition truncate block">{{ $resume->phone }}</a>
                            </div>
                        </div>
                        @endif

                        @if($resume->whatsapp)
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <i class="fab fa-whatsapp text-sm"></i>
                            </div>
                            <div class="min-w-0 flex-1 pt-1">
                                <span class="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">{{ __('WhatsApp') }}</span>
                                <a href="{{ $resume->whatsapp_url }}" target="_blank" class="font-bold text-emerald-700 hover:text-emerald-800 transition truncate flex items-center gap-1.5">
                                    <span>{{ $resume->whatsapp }}</span>
                                    <i class="fas fa-external-link-alt text-[9px]"></i>
                                </a>
                            </div>
                        </div>
                        @endif

                        @if($resume->location)
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="min-w-0 flex-1 pt-1">
                                <span class="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">{{ __('Şəhər / Məkan') }}</span>
                                <span class="font-bold text-gray-900 block">{{ $resume->location }}</span>
                            </div>
                        </div>
                        @endif
                    </div>
                </div>

                <!-- Skills Card -->
                @if(!empty($resume->skills) && is_array($resume->skills))
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
                    <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
                        <i class="fas fa-tools text-primary text-xs"></i>
                        <span>{{ __('Bacarıqlar') }}</span>
                    </h3>

                    <div class="flex flex-wrap gap-2">
                        @foreach($resume->skills as $sk)
                        @php
                            $sName = is_array($sk) ? ($sk['skill'] ?? '') : $sk;
                            $sLevel = is_array($sk) ? ($sk['level'] ?? '') : null;
                        @endphp
                        @if($sName)
                        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50/70 border border-orange-100 text-xs font-semibold text-orange-950">
                            <span>{{ $sName }}</span>
                            @if($sLevel)
                            <span class="text-[10px] text-primary font-normal">({{ $sLevel }})</span>
                            @endif
                        </div>
                        @endif
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Languages Card -->
                @if(!empty($resume->languages) && is_array($resume->languages))
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
                    <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
                        <i class="fas fa-language text-primary text-xs"></i>
                        <span>{{ __('Xarici Dillər') }}</span>
                    </h3>

                    <div class="space-y-2 text-xs">
                        @foreach($resume->languages as $lang)
                        <div class="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                            <span class="font-bold text-gray-800">{{ $lang['language'] ?? '' }}</span>
                            @if(!empty($lang['level']))
                            <span class="text-[11px] font-semibold text-primary px-2 py-0.5 rounded bg-orange-50">{{ $lang['level'] }}</span>
                            @endif
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Links & Social Profiles -->
                @if($resume->linkedin_url || $resume->github_url || $resume->portfolio_url)
                <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
                    <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
                        <i class="fas fa-link text-primary text-xs"></i>
                        <span>{{ __('Portfel və Sosial Şəbəkələr') }}</span>
                    </h3>

                    <div class="space-y-2 text-xs">
                        @if($resume->linkedin_url)
                        <a href="{{ $resume->linkedin_url }}" target="_blank"
                           class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 text-gray-700 hover:text-blue-600 transition">
                            <span class="flex items-center gap-2 font-bold">
                                <i class="fab fa-linkedin text-blue-600 text-sm"></i>
                                <span>LinkedIn</span>
                            </span>
                            <i class="fas fa-external-link-alt text-[10px] text-gray-400"></i>
                        </a>
                        @endif

                        @if($resume->github_url)
                        <a href="{{ $resume->github_url }}" target="_blank"
                           class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-slate-800 hover:bg-slate-50 text-gray-700 hover:text-slate-900 transition">
                            <span class="flex items-center gap-2 font-bold">
                                <i class="fab fa-github text-slate-900 text-sm"></i>
                                <span>GitHub</span>
                            </span>
                            <i class="fas fa-external-link-alt text-[10px] text-gray-400"></i>
                        </a>
                        @endif

                        @if($resume->portfolio_url)
                        <a href="{{ $resume->portfolio_url }}" target="_blank"
                           class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-orange-50/40 text-gray-700 hover:text-primary transition">
                            <span class="flex items-center gap-2 font-bold">
                                <i class="fas fa-globe text-primary text-sm"></i>
                                <span>{{ __('Veb Sayt / Portfel') }}</span>
                            </span>
                            <i class="fas fa-external-link-alt text-[10px] text-gray-400"></i>
                        </a>
                        @endif
                    </div>
                </div>
                @endif

                <!-- Print & PDF CTA Card -->
                <div class="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3 text-center">
                    <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto text-primary text-lg">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <h4 class="font-bold text-sm text-white">{{ __('CV Sənədini Çap Et') }}</h4>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        {{ __('Bu CV-ni orijinal PDF formatında endirə və ya birbaşa çap edə bilərsiniz.') }}
                    </p>
                    <a href="{{ route('resumes.show', ['resume' => $resume->id, 'print' => 1]) }}" target="_blank"
                       class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs transition">
                        <i class="fas fa-print text-xs"></i>
                        <span>{{ __('Çap Formatında Aç') }}</span>
                    </a>
                </div>

            </div>

        </div>
    </div>
</div>
@endsection
