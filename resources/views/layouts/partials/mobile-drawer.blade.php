@php
    $currentLocale = app()->getLocale();
    $locales = config('app.available_locales');
@endphp

<div x-show="mobileDrawerOpen" x-cloak class="md:hidden fixed inset-0 z-50">
  <!-- Backdrop Blur Layer -->
  <div class="w-full h-full flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300"
       @click="mobileDrawerOpen = false">
    
    <!-- Spacer click area -->
    <div class="flex-1"></div>

    <!-- Bottom Sheet Container -->
    <div class="bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 space-y-4 border-t border-gray-100 transform transition-transform duration-300"
         @click.stop>

      <!-- Drawer Header -->
      <div class="flex items-center justify-between pb-3 border-b border-gray-100">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-xs">
              J
          </div>
          <span class="font-bold text-base text-gray-800">{{ config('app.brand_name', 'Jobing') }}<span class="text-primary">{{ config('app.brand_suffix', '.az') }}</span></span>
        </div>
        <button type="button" @click="mobileDrawerOpen = false" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <!-- Quick Action Buttons -->
      <div class="grid {{ (auth()->check() && auth()->user()->isCompany()) ? 'grid-cols-1' : 'grid-cols-2' }} gap-2.5">
        <a href="{{ route('jobs.create') }}" class="flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-xs shadow-sm active:scale-95 transition-all">
          <i class="fa-solid fa-plus text-sm"></i>
          <span>{{ __('Vakansiya ver') }}</span>
        </a>
        @if(!auth()->check() || !auth()->user()->isCompany())
        <a href="{{ route('job-seekers.create') }}" class="flex items-center justify-center gap-2 py-3 px-4 bg-orange-50 hover:bg-orange-100 text-primary border border-orange-200 rounded-2xl font-bold text-xs shadow-xs active:scale-95 transition-all">
          <i class="fa-solid fa-user-plus text-xs"></i>
          <span>{{ __('İş axtarış elanı') }}</span>
        </a>
        @endif
      </div>

      <!-- Navigation Links List -->
      <div class="space-y-1 py-1">
        <a href="{{ route('home') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('home') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-house text-gray-400 w-5 text-center"></i> {{ __('Ana Səhifə') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="{{ route('jobs.index') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('jobs.*') && !request()->routeIs('jobs.create') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-briefcase text-gray-400 w-5 text-center"></i> {{ __('Vakansiyalar') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="{{ route('companies.index') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('companies.*') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-building text-gray-400 w-5 text-center"></i> {{ __('Şirkətlər') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="{{ route('job-seekers.index') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('job-seekers.*') && !request()->routeIs('job-seekers.create') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-user-tie text-gray-400 w-5 text-center"></i> {{ __('İş Axtaranlar') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="{{ route('resumes.index') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('resumes.*') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-file-lines text-gray-400 w-5 text-center"></i> {{ __('CV Bazası') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="{{ route('favorites.index') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('favorites.*') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-heart text-gray-400 w-5 text-center"></i> {{ __('Sevimlilər') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="{{ route('blog.index') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('blog.*') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-newspaper text-gray-400 w-5 text-center"></i> {{ __('Bloq və Məqalələr') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="{{ route('about') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('about') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-circle-info text-gray-400 w-5 text-center"></i> {{ __('Haqqımızda') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="{{ route('contact.index') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl {{ request()->routeIs('contact.*') ? 'text-primary bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium' }} text-sm">
          <span class="flex items-center gap-3"><i class="fa-solid fa-envelope text-gray-400 w-5 text-center"></i> {{ __('Əlaqə') }}</span>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
      </div>

      <!-- Language Selector with Flags -->
      <div class="pt-3 border-t border-gray-100">
        <div class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">{{ __('Dil seçimi') }}</div>
        <div class="grid grid-cols-4 gap-1.5">
          @foreach($locales as $lKey => $lData)
            <a href="{{ route('lang.switch', $lKey) }}"
               class="flex items-center justify-center gap-1.5 py-2 px-2 rounded-2xl text-xs font-semibold border transition {{ $currentLocale === $lKey ? 'border-primary bg-orange-50 text-primary shadow-2xs font-bold' : 'border-gray-200 text-gray-700 hover:bg-gray-50' }}">
              <span class="text-sm">{{ $lData['flag'] }}</span>
              <span class="uppercase">{{ $lData['code'] ?? $lKey }}</span>
            </a>
          @endforeach
        </div>
      </div>

      <!-- Auth / Account Actions -->
      <div class="pt-3 border-t border-gray-100">
        @auth
          <div class="space-y-1">
            <div class="px-3.5 py-2 mb-1 bg-gray-50 rounded-xl">
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
            <a href="{{ $panelUrl }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span class="flex items-center gap-3">
                <i class="fa-solid {{ $panelIcon }} text-primary w-5 text-center"></i>
                <span>{{ $panelLabel }}</span>
              </span>
              @if($unreadCount > 0)
              <span class="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {{ $unreadCount }}
              </span>
              @endif
            </a>
            @if(auth()->user()->isUser())
            <a href="{{ route('filament.user.resources.my-resumes.index') }}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span class="flex items-center gap-3">
                <i class="fa-solid fa-file-lines text-primary w-5 text-center"></i>
                <span>{{ __('CV & Rezümələrim') }}</span>
              </span>
            </a>
            @endif
            <form method="POST" action="{{ route('logout') }}" class="m-0 js-logout pt-1">
              @csrf
              <button type="submit" class="w-full flex items-center px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left font-medium rounded-xl cursor-pointer">
                <i class="fa-solid fa-arrow-right-from-bracket w-5 text-center mr-3"></i> {{ __('Çıxış') }}
              </button>
            </form>
          </div>
        @else
          <a href="{{ route('login') }}" class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-semibold text-xs shadow-sm transition active:scale-95">
            <i class="fa-solid fa-user text-sm"></i>
            <span>{{ __('Daxil ol / Qeydiyyat') }}</span>
          </a>
        @endauth
      </div>

    </div>
  </div>
</div>
