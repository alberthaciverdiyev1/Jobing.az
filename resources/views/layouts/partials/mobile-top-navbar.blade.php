@php
    $currentLocale = app()->getLocale();
    $locales = config('app.available_locales');
    $activeLocaleInfo = $locales[$currentLocale] ?? reset($locales);
@endphp

{{-- Mobile Top Navbar: Brand on Left, Language Dropdown & Notifications on Right --}}
<header class="md:hidden bg-white border-b border-gray-200/80 sticky top-0 z-30 px-3.5 h-14 flex items-center justify-between shadow-2xs select-none">
    {{-- Left: Brand Logo --}}
    <a href="{{ route('home') }}" class="shrink-0 flex items-center gap-2 group">
        <div class="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition duration-200">
            J
        </div>
        <span class="text-[17px] font-bold text-gray-800 tracking-tight font-sans">
            {{ config('app.brand_name', 'Jobing') }}<span class="text-primary font-bold">{{ config('app.brand_suffix', '.az') }}</span>
        </span>
    </a>

    {{-- Right: Language Dropdown + Notification / User Icon --}}
    <div class="flex items-center gap-2 shrink-0">
        {{-- Language Custom Dropdown (Alpine.js) --}}
        <div class="relative" x-data="{ mobileLangOpen: false }" @click.outside="mobileLangOpen = false">
            <button type="button"
                    @click="mobileLangOpen = !mobileLangOpen"
                    class="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200/70 border border-gray-200/80 rounded-xl px-2.5 py-1.5 transition-all shadow-2xs cursor-pointer select-none">
                <span class="text-xs leading-none">
                    {{ $activeLocaleInfo['flag'] ?? '🌐' }}
                </span>
                <span class="text-[11px] font-semibold text-gray-800 leading-none uppercase tracking-wider">
                    {{ $activeLocaleInfo['code'] ?? strtoupper($currentLocale) }}
                </span>
                <i class="fa-solid fa-chevron-down text-[8px] text-gray-400 transition-transform duration-200 pointer-events-none" :class="mobileLangOpen ? 'rotate-180' : ''"></i>
            </button>

            {{-- Language Menu Dropdown --}}
            <div x-show="mobileLangOpen" x-cloak
                 x-transition:enter="transition ease-out duration-100"
                 x-transition:enter-start="transform opacity-0 scale-95"
                 x-transition:enter-end="transform opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-75"
                 x-transition:leave-start="transform opacity-100 scale-100"
                 x-transition:leave-end="transform opacity-0 scale-95"
                 class="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-50 overflow-hidden">
                <div class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                    {{ __('Dil seçimi') }}
                </div>
                @foreach($locales as $lCode => $lData)
                    <a href="{{ route('lang.switch', $lCode) }}" 
                       class="flex items-center justify-between px-3 py-2 text-xs transition {{ $currentLocale === $lCode ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-gray-50' }}">
                        <div class="flex items-center gap-2.5">
                            <span class="text-base leading-none">{{ $lData['flag'] }}</span>
                            <span>{{ $lData['name'] }}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[10px] uppercase font-bold {{ $currentLocale === $lCode ? 'text-orange-500' : 'text-gray-400' }}">{{ $lCode }}</span>
                            @if($currentLocale === $lCode)
                                <i class="fa-solid fa-check text-[11px] text-orange-500"></i>
                            @endif
                        </div>
                    </a>
                @endforeach
            </div>
        </div>

        {{-- Auth Notifications or Login --}}
        @auth
        <a href="{{ auth()->user()->panelPath() }}"
           class="relative inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-600 hover:text-primary transition">
            <i class="fa-regular fa-bell text-xs"></i>
            @if($unreadCount > 0)
            <span class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center border-2 border-white shadow-2xs">
                {{ $unreadCount > 9 ? '9+' : $unreadCount }}
            </span>
            @endif
        </a>
        @else
        <a href="{{ route('login') }}"
           class="inline-flex items-center gap-1 bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-2xs active:scale-95 transition">
            <i class="fa-solid fa-arrow-right-to-bracket text-[10px]"></i>
            <span>{{ __('Giriş') }}</span>
        </a>
        @endauth
    </div>
</header>
