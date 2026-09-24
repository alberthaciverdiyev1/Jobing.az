@php
    $currentLocale = app()->getLocale();
    $locales = config('app.available_locales');
    $activeLocaleInfo = $locales[$currentLocale] ?? reset($locales);
@endphp

<header class="xl:hidden bg-white border-b border-gray-200/80 sticky top-0 z-[60] px-3.5 flex items-center justify-between shadow-2xs select-none"
        x-data="{ hiddenByOverlay: false }"
        x-show="!hiddenByOverlay"
        @mobile-navbar-visibility.window="hiddenByOverlay = !$event.detail.visible"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 -translate-y-0"
        x-transition:leave-end="opacity-0 -translate-y-full"
        x-transition:enter="transition ease-out duration-150"
        x-transition:enter-start="opacity-0 -translate-y-full"
        x-transition:enter-end="opacity-100 -translate-y-0"
        style="height: 56px; min-height: 56px;">
    <a href="{{ route('jobs.index') }}" class="shrink-0 flex items-center">
        <img src="{{ asset('images/logo/jobing-wordmark.png') }}" alt="{{ config('app.full_name') }}" class="h-7 sm:h-9 w-auto">
    </a>

    <div class="flex items-center gap-2 shrink-0">
        <div class="relative" x-data="{ mobileLangOpen: false }" @click.outside="mobileLangOpen = false">
            <button type="button"
                    @click="mobileLangOpen = !mobileLangOpen"
                    class="w-11 h-9 flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 active:bg-gray-200/70 border border-gray-200/80 rounded-xl transition-all shadow-2xs cursor-pointer select-none">
                <span class="text-xs font-medium text-gray-800 leading-none">
                    {{ $activeLocaleInfo['code'] ?? strtoupper($currentLocale) }}
                </span>
                <i class="fa-solid fa-chevron-down text-[9px] text-gray-400 transition-transform duration-200 pointer-events-none" :class="mobileLangOpen ? 'rotate-180' : ''"></i>
            </button>

            <div x-show="mobileLangOpen" x-cloak
                 x-transition:enter="transition ease-out duration-100"
                 x-transition:enter-start="transform opacity-0 scale-95"
                 x-transition:enter-end="transform opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-75"
                 x-transition:leave-start="transform opacity-100 scale-100"
                 x-transition:leave-end="transform opacity-0 scale-95"
                 class="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-[70] overflow-hidden">
                <div class="px-3 py-1 text-[12px] font-medium text-gray-400 border-b border-gray-100 mb-1">
                    {{ __('Language selection') }}
                </div>
                @foreach($locales as $lCode => $lData)
                    <a href="{{ route('lang.switch', $lCode) }}"
                       class="flex items-center justify-between px-3 py-2 text-sm transition {{ $currentLocale === $lCode ? 'bg-orange-50 text-gray-800 font-semibold' : 'text-gray-700 hover:bg-gray-50' }}">
                        <div class="flex items-center gap-2.5">
                            <span>{{ $lData['name'] }}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[12px] uppercase font-semibold {{ $currentLocale === $lCode ? 'text-orange-500' : 'text-gray-400' }}">{{ $lCode }}</span>
                            @if($currentLocale === $lCode)
                                <i class="fa-solid fa-check text-xs text-orange-500"></i>
                            @endif
                        </div>
                    </a>
                @endforeach
            </div>
        </div>

        @auth
        <a href="{{ auth()->user()->panelPath() }}"
           class="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-600 hover:text-primary transition">
            <i class="fa-regular fa-bell text-sm"></i>
            @if($unreadCount > 0)
            <span class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-semibold flex items-center justify-center border-2 border-white shadow-2xs">
                {{ $unreadCount > 9 ? '9+' : $unreadCount }}
            </span>
            @endif
        </a>
        @else
        <a href="{{ route('login') }}"
           class="inline-flex items-center gap-1 bg-gray-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl shadow-2xs active:scale-95 transition">
            <i class="fa-solid fa-arrow-right-to-bracket text-[12px]"></i>
            <span>{{ __('Login') }}</span>
        </a>
        @endauth
    </div>
</header>
