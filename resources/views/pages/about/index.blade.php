@extends('layouts.app')

@section('title', __('Haqqımızda') . ' - ' . config('app.full_name'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-20">

    <!-- Hero Header -->
    <div class="relative bg-white border-b border-gray-200/80 overflow-hidden">
        <div class="absolute inset-0 bg-radial from-orange-50/70 via-transparent to-transparent opacity-70 pointer-events-none"></div>
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative">
            <div class="max-w-3xl mx-auto text-center space-y-4">
                <span class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-100 text-primary text-xs font-extrabold uppercase tracking-wider">
                    <i class="fas fa-sparkles text-[10px]"></i>
                    {{ __('Jobing.az Haqqında') }}
                </span>
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {{ __('Azərbaycanın Müasir') }} <span class="text-primary">{{ __('Karyera') }}</span> {{ __('və İstedad Ekosistemi') }}
                </h1>
                <p class="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {{ __('Jobing.az – proqramlaşdırma, dizayn, marketinq, idarəetmə və digər peşə sahələri üzrə istedadlarla ölkənin aparıcı şirkətlərini ən sürətli və şəffaf şəkildə birləşdirən rəqəmsal karyera platformasıdır.') }}
                </p>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 max-w-6xl space-y-12">

        <!-- Live Platform Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-xl shrink-0">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div>
                    <span class="text-xl sm:text-2xl font-black text-gray-900 block font-mono">{{ $stats['vacancies'] }}+</span>
                    <span class="text-xs font-semibold text-gray-500 block">{{ __('Aktiv Vakansiya') }}</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                    <i class="fas fa-building"></i>
                </div>
                <div>
                    <span class="text-xl sm:text-2xl font-black text-gray-900 block font-mono">{{ $stats['companies'] }}+</span>
                    <span class="text-xs font-semibold text-gray-500 block">{{ __('Şirkət & Tərəfdaş') }}</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                    <i class="fas fa-file-invoice"></i>
                </div>
                <div>
                    <span class="text-xl sm:text-2xl font-black text-gray-900 block font-mono">{{ $stats['resumes'] }}+</span>
                    <span class="text-xs font-semibold text-gray-500 block">{{ __('Peşəkar CV / Rezüme') }}</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div>
                    <span class="text-xl sm:text-2xl font-black text-gray-900 block font-mono">{{ $stats['jobSeekers'] }}+</span>
                    <span class="text-xs font-semibold text-gray-500 block">{{ __('İş Axtarış Elanı') }}</span>
                </div>
            </div>
        </div>

        <!-- Mission & Vision Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 shadow-2xs space-y-3">
                <div class="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-base font-bold">
                    <i class="fas fa-bullseye"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">{{ __('Missiyamız') }}</h3>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {{ __('İş axtarışı prosesini mürəkkəb bürokratiyadan azad edərək, hər bir namizədin bacarıqlarına uyğun ən doğru iş fürsətini tapmasını, eyni zamanda şirkətlərin ehtiyac duyduğu istedadlara ən qısa müddətdə və birbaşa çıxış əldə etməsini təmin etməkdir.') }}
                </p>
            </div>

            <div class="bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 shadow-2xs space-y-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold">
                    <i class="fas fa-eye"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">{{ __('Vizyonumuz') }}</h3>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {{ __('Azərbaycanın və regionun ən müasir, texnoloji cəhətdən qabaqcıl və istifadəçi mərkəzli iş portalına çevrilmək; həm yerli əmək bazarında, həm də beynəlxalq uzaqdan (remote) iş imkanlarında etibarlı bələdçi olmaq.') }}
                </p>
            </div>
        </div>

        <!-- Why Jobing.az (Core Features) -->
        <div class="space-y-6">
            <div class="text-center max-w-xl mx-auto space-y-2">
                <h2 class="text-2xl font-bold text-gray-900">{{ __('Niyə Məhz Jobing.az?') }}</h2>
                <p class="text-xs sm:text-sm text-gray-500">{{ __('Platformamızı digərlərindən fərqləndirən əsas prinsiplərimiz.') }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:border-primary/40 transition space-y-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-base font-bold">
                        <i class="fas fa-filter"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ __('Ağıllı Filtrləmə') }}</h4>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        {{ __('Kateqoriyalar, iş qrafiki, iş rejimi (Ofis/Hibrid/Remote) və tələb olunan bacarıqlar üzrə ani axtarış imkanı.') }}
                    </p>
                </div>

                <div class="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:border-primary/40 transition space-y-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base font-bold">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ __('Şəffaf Maaş Göstəriciləri') }}</h4>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        {{ __('Elanlarda maaş aralıqları aydın göstərilir, vaxtınıza qənaət edərək gözləntinizə uyğun vakansiyalara müraciət edirsiniz.') }}
                    </p>
                </div>

                <div class="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:border-primary/40 transition space-y-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold">
                        <i class="fas fa-paper-plane"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ __('Birbaşa & Asan Müraciət') }}</h4>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        {{ __('Qeydiyyatsız və ya profil üzərindən bir kliklə müraciət, birbaşa şirkət e-poçtuna çatdırılma.') }}
                    </p>
                </div>

                <div class="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs hover:border-primary/40 transition space-y-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base font-bold">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ __('Təsdiqlənmiş Şirkətlər') }}</h4>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        {{ __('Spam və qeyri-ciddi elanların qarşısını almaq üçün bütün elanlar admin heyəti tərəfindən diqqətlə nəzərdən keçirilir.') }}
                    </p>
                </div>
            </div>
        </div>

        <!-- For Job Seekers vs For Employers -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Job Seekers -->
            <div class="bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-base font-bold">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 text-base">{{ __('Namizədlər Üçün') }}</h3>
                        <p class="text-xs text-gray-400">{{ __('Karyeranızı bir addım önə daşıyın') }}</p>
                    </div>
                </div>

                <ul class="space-y-3 text-xs sm:text-sm text-gray-600">
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-emerald-500 mt-1 shrink-0"></i>
                        <span>{{ __('Geniş vakansiya bazası və texnologiya üzrə ixtisaslaşmış kateqoriyalar') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-emerald-500 mt-1 shrink-0"></i>
                        <span>{{ __('Fərdi "İş Arıyorum" elanı yerləşdirərək şirkətlərin sizi tapmasını təmin etmək') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-emerald-500 mt-1 shrink-0"></i>
                        <span>{{ __('Onlayn CV yaratmaq və PDF formatında çap etmək imkanı') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-emerald-500 mt-1 shrink-0"></i>
                        <span>{{ __('Bəyəndiyiniz vakansiyaları sevimlilərə əlavə edib saxlamaq') }}</span>
                    </li>
                </ul>

                <div class="pt-2">
                    <a href="{{ route('jobs.index') }}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition shadow-xs">
                        <i class="fas fa-search"></i>
                        <span>{{ __('Vakansiyaları Kəşf Et') }}</span>
                    </a>
                </div>
            </div>

            <!-- Employers -->
            <div class="bg-white rounded-2xl p-7 sm:p-8 border border-gray-200 shadow-2xs space-y-5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold">
                        <i class="fas fa-city"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 text-base">{{ __('Şirkətlər & İşəgötürənlər Üçün') }}</h3>
                        <p class="text-xs text-gray-400">{{ __('Komandanız üçün ən güclü namizədləri tapın') }}</p>
                    </div>
                </div>

                <ul class="space-y-3 text-xs sm:text-sm text-gray-600">
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-blue-500 mt-1 shrink-0"></i>
                        <span>{{ __('Cəmi bir neçə dəqiqə ərzində rahat və müasir vakansiya yerləşdirmə') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-blue-500 mt-1 shrink-0"></i>
                        <span>{{ __('Zəngin CV bazasına və iş axtaran mütəxəssislərin elanlarına çıxış') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-blue-500 mt-1 shrink-0"></i>
                        <span>{{ __('Rəsmi şirkət profili yaradaraq brend tanınmasını artırmaq') }}</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                        <i class="fas fa-check-circle text-blue-500 mt-1 shrink-0"></i>
                        <span>{{ __('Daxil olan müraciətləri və bildirişləri vahid paneldən izləmək') }}</span>
                    </li>
                </ul>

                <div class="pt-2">
                    <a href="{{ route('jobs.create') }}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs">
                        <i class="fas fa-plus"></i>
                        <span>{{ __('Elan Yerləşdir') }}</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- CTA Card -->
        <div class="rounded-3xl bg-linear-to-r from-orange-500 to-amber-600 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="space-y-2 text-center md:text-left">
                <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight">{{ __('Karyera Məqsədinizə Bizimlə Çatın') }}</h3>
                <p class="text-white/90 text-xs sm:text-sm max-w-xl">
                    {{ __('İstər yeni iş axtarışında olun, istərsə də komandanıza yeni peşəkar cəlb edin – Jobing.az hər zaman yanınızdadır.') }}
                </p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
                <a href="{{ route('contact.index') }}" class="px-6 py-3 rounded-xl bg-white text-gray-900 text-xs font-extrabold hover:bg-gray-50 transition shadow-md">
                    {{ __('Bizimlə Əlaqə') }}
                </a>
            </div>
        </div>

    </div>
</div>
@endsection
