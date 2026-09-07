@php
    $currentLocale = app()->getLocale();
    $locales = config('app.available_locales');
    $activeLocaleInfo = $locales[$currentLocale] ?? reset($locales);
@endphp

<header class="hidden md:block glass-nav sticky top-0 z-50 border-b border-gray-200 shadow-xs transition-all duration-300">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 relative">
            <!-- Left: Logo -->
            <div class="shrink-0 flex items-center">
                <a href="{{ route('home') }}" class="flex items-center gap-2 group">
                    <div class="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition duration-300">
                        J
                    </div>
                    <span class="font-bold text-2xl text-dark tracking-tight">{{ config('app.brand_name') }}<span class="text-primary">{{ config('app.brand_suffix') }}</span></span>
                </a>
            </div>

            <!-- Center: Desktop Menu -->
            <nav class="flex items-center justify-center space-x-6 lg:space-x-8">
                <a href="{{ route('jobs.index') }}" class="{{ request()->routeIs('jobs.*') && !request()->routeIs('jobs.create') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary' }} font-medium transition-colors text-sm">
                    {{ __('Vakansiyalar') }}
                </a>
                <a href="{{ route('companies.index') }}" class="{{ request()->routeIs('companies.*') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary' }} font-medium transition-colors text-sm">
                    {{ __('Şirkətlər') }}
                </a>
                <a href="{{ route('job-seekers.index') }}" class="{{ request()->routeIs('job-seekers.*') && !request()->routeIs('job-seekers.create') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary' }} font-medium transition-colors text-sm">
                    {{ __('İş Arıyorum') }}
                </a>
                <a href="{{ route('resumes.index') }}" class="{{ request()->routeIs('resumes.*') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary' }} font-medium transition-colors text-sm">
                    {{ __('CV Bazası') }}
                </a>
                <a href="{{ route('blog.index') }}" class="{{ request()->routeIs('blog.*') ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary' }} font-medium transition-colors text-sm">
                    {{ __('Bloq') }}
                </a>
            </nav>

            <!-- Right Actions: Favorites + Language Switcher + Auth + CTA -->
            <div class="flex items-center space-x-3">

                <!-- Language Selector (Alpine.js) -->
                <div class="relative" x-data="{ langOpen: false }" @click.outside="langOpen = false">
                    <button type="button" @click="langOpen = !langOpen"
                            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer">
                        <span>{{ $activeLocaleInfo['flag'] }}</span>
                        <span>{{ $activeLocaleInfo['code'] }}</span>
                        <i class="fas fa-chevron-down text-[10px] text-gray-400 transition-transform" :class="langOpen ? 'rotate-180' : ''"></i>
                    </button>

                    <div x-show="langOpen" x-cloak
                         x-transition:enter="transition ease-out duration-100"
                         x-transition:enter-start="transform opacity-0 scale-95"
                         x-transition:enter-end="transform opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-75"
                         x-transition:leave-start="transform opacity-100 scale-100"
                         x-transition:leave-end="transform opacity-0 scale-95"
                         class="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-gray-100 shadow-xl py-1.5 z-50">
                        @foreach($locales as $code => $data)
                        <a href="{{ route('lang.switch', $code) }}"
                           class="flex items-center justify-between px-3.5 py-2 text-xs font-semibold {{ $currentLocale === $code ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-700 hover:bg-gray-50' }} transition">
                            <span class="flex items-center gap-2">
                                <span>{{ $data['flag'] }}</span>
                                <span>{{ $data['name'] }}</span>
                            </span>
                            <span class="text-[10px] text-gray-400 uppercase font-mono">{{ $code }}</span>
                        </a>
                        @endforeach
                    </div>
                </div>

                <!-- Favorites Heart Button -->
                <a href="{{ route('favorites.index') }}"
                   class="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:text-primary hover:bg-gray-50 transition cursor-pointer {{ request()->routeIs('favorites.*') ? 'border-primary text-primary bg-orange-50/50' : '' }}"
                   title="{{ __('Sevimlilər') }}">
                    <i class="far fa-heart text-sm"></i>
                    <span id="favorites-count-nav" class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold items-center justify-center border-2 border-white shadow-2xs"></span>
                </a>

                <!-- Auth: Guest / User -->
                @auth
                <!-- Notification Bell Dropdown -->
                <div class="relative" x-data="{ notifOpen: false }" @click.outside="notifOpen = false">
                    <button type="button" @click="notifOpen = !notifOpen"
                            class="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:text-primary hover:bg-gray-50 transition cursor-pointer">
                        <i class="far fa-bell text-sm"></i>
                        @if($unreadCount > 0)
                        <span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-2xs">
                            {{ $unreadCount > 9 ? '9+' : $unreadCount }}
                        </span>
                        @endif
                    </button>

                    <div x-show="notifOpen" x-cloak
                         x-transition:enter="transition ease-out duration-100"
                         x-transition:enter-start="transform opacity-0 scale-95"
                         x-transition:enter-end="transform opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-75"
                         x-transition:leave-start="transform opacity-100 scale-100"
                         x-transition:leave-end="transform opacity-0 scale-95"
                         class="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-gray-100 shadow-2xl py-2 z-50">
                        <div class="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                            <h4 class="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                                <i class="fas fa-bell text-primary"></i>
                                <span>{{ __('Bildirişlərim') }}</span>
                            </h4>
                            @if($unreadCount > 0)
                            <span class="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold">
                                {{ $unreadCount }} {{ __('yeni') }}
                            </span>
                            @endif
                        </div>

                        <div class="max-h-80 overflow-y-auto divide-y divide-gray-50">
                            @forelse($latestUserNotifs as $notif)
                            @php
                                $nData = $notif->data ?? [];
                                $nTitle = $nData['title'] ?? __('Bildiriş');
                                $nBody = $nData['body'] ?? '';
                                $nAction = $nData['actions'][0]['url'] ?? null;
                            @endphp
                            <a href="{{ $nAction ?: '#' }}" class="block p-3.5 hover:bg-gray-50/80 transition {{ $notif->read_at ? 'opacity-70' : 'bg-orange-50/20' }}">
                                <div class="flex items-start gap-2.5">
                                    <div class="w-2 h-2 rounded-full mt-1.5 shrink-0 {{ $notif->read_at ? 'bg-gray-300' : 'bg-primary' }}"></div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-xs font-bold text-gray-900 truncate">{{ $nTitle }}</p>
                                        <p class="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-snug">{{ $nBody }}</p>
                                        <span class="text-[9px] text-gray-400 font-mono mt-1 block">{{ $notif->created_at->diffForHumans() }}</span>
                                    </div>
                                </div>
                            </a>
                            @empty
                            <div class="p-6 text-center text-xs text-gray-400">
                                <i class="far fa-bell-slash text-xl mb-2 text-gray-300 block"></i>
                                {{ __('Hələ heç bir bildirişiniz yoxdur') }}
                            </div>
                            @endforelse
                        </div>

                        @php
                            $panelNotifUrl = auth()->user()->panelPath();
                        @endphp
                        <div class="p-2 border-t border-gray-100 text-center bg-gray-50/50 rounded-b-2xl">
                            <a href="{{ $panelNotifUrl }}" class="text-[11px] font-bold text-primary hover:underline">
                                {{ __('Bütün bildirişlərə bax') }} →
                            </a>
                        </div>
                    </div>
                </div>

                <div class="relative" x-data="{ userOpen: false }" @click.outside="userOpen = false">
                    <button type="button" @click="userOpen = !userOpen"
                            class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer">
                        <span class="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                            {{ mb_substr(auth()->user()->name ?? 'J', 0, 1) }}
                        </span>
                        <span class="max-w-[100px] truncate">{{ auth()->user()->name }}</span>
                        <i class="fas fa-chevron-down text-[10px] text-gray-400 transition-transform" :class="userOpen ? 'rotate-180' : ''"></i>
                    </button>

                    <div x-show="userOpen" x-cloak
                         x-transition:enter="transition ease-out duration-100"
                         x-transition:enter-start="transform opacity-0 scale-95"
                         x-transition:enter-end="transform opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-75"
                         x-transition:leave-start="transform opacity-100 scale-100"
                         x-transition:leave-end="transform opacity-0 scale-95"
                         class="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-100 shadow-xl py-1.5 z-50">
                        <div class="px-3.5 py-2 border-b border-gray-100 mb-1">
                            <p class="text-xs font-bold text-gray-900 truncate">{{ auth()->user()->name }}</p>
                            <p class="text-[11px] text-gray-400 truncate">{{ auth()->user()->email }}</p>
                        </div>
                        @php
                            $panelUrl = auth()->user()->panelPath();
                            $panelLabel = auth()->user()->is_admin ? __('İdarə Paneli')
                                : (auth()->user()->isCompany() ? __('Şirkət Paneli') : __('Hesabım'));
                            $panelIcon = auth()->user()->is_admin ? 'fa-shield-alt'
                                : (auth()->user()->isCompany() ? 'fa-building' : 'fa-user');
                        @endphp
                        <a href="{{ $panelUrl }}" class="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                            <span class="flex items-center gap-2">
                                <i class="fas {{ $panelIcon }} text-[11px] text-primary"></i>
                                <span>{{ $panelLabel }}</span>
                            </span>
                            @if($unreadCount > 0)
                            <span class="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                                {{ $unreadCount }}
                            </span>
                            @endif
                        </a>
                        @if(auth()->user()->isUser())
                        <a href="{{ route('filament.user.resources.my-resumes.index') }}" class="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                            <i class="fas fa-file-lines text-[11px] text-primary"></i>
                            <span>{{ __('CV & Rezümələrim') }}</span>
                        </a>
                        @endif
                        <a href="{{ route('jobs.create') }}" class="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                            <i class="fas fa-plus text-[11px] text-primary"></i>
                            <span>{{ __('Vakansiya yerləşdir') }}</span>
                        </a>
                        <a href="{{ route('job-seekers.create') }}" class="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                            <i class="fas fa-user-plus text-[11px] text-primary"></i>
                            <span>{{ __('İş axtarış elanı əlavə et') }}</span>
                        </a>
                        <form method="POST" action="{{ route('logout') }}" class="border-t border-gray-100 mt-1">
                            @csrf
                            <button type="submit" class="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer">
                                <i class="fas fa-sign-out-alt text-[11px]"></i>
                                <span>{{ __('Çıxış') }}</span>
                            </button>
                        </form>
                    </div>
                </div>
                @else
                <a href="{{ route('login') }}" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary hover:text-primary bg-white text-gray-800 font-bold text-xs transition shadow-2xs">
                    <i class="fas fa-sign-in-alt text-xs text-primary"></i>
                    <span>{{ __('Daxil ol') }}</span>
                </a>
                @endauth

                <!-- Job Seeker CTA Button -->
                <a href="{{ route('job-seekers.create') }}"
                   class="hidden lg:inline-flex items-center gap-1.5 border border-gray-200 hover:border-primary hover:text-primary bg-white text-gray-700 font-bold px-3.5 py-2 rounded-lg transition-colors text-xs shadow-2xs">
                    <i class="fas fa-user-plus text-[11px] text-primary"></i>
                    <span>{{ __('İş axtarış elanı') }}</span>
                </a>

                <!-- Post Vacancy CTA Button -->
                <a href="{{ route('jobs.create') }}" class="bg-primary hover:bg-primary-dark text-white px-3.5 py-2 rounded-lg font-bold transition-colors shadow-xs hover:shadow-md flex items-center gap-1.5 text-xs whitespace-nowrap">
                    <i class="fas fa-plus text-[10px]"></i>
                    <span>{{ __('Elan yerləşdir') }}</span>
                </a>
            </div>
        </div>
    </div>
</header>
