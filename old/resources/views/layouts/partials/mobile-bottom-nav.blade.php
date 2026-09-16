<nav id="mobileBottomNav" class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/90 px-2 flex items-center justify-around select-none h-16 shadow-lg">

  <!-- 1. VAKANSİYALAR -->
  <a href="{{ route('jobs.index') }}" class="flex flex-col items-center justify-center flex-1 py-1 text-center transition {{ request()->routeIs('jobs.index') || request()->routeIs('home') ? 'text-primary font-bold' : 'text-gray-400 hover:text-gray-700' }}">
    <i class="fa-solid fa-briefcase text-lg mb-0.5"></i>
    <span class="text-[9px] font-semibold uppercase tracking-tight">{{ __('Vacancies') }}</span>
  </a>

  <!-- 2. ŞİRKƏTLƏR -->
  <a href="{{ route('companies.index') }}" class="flex flex-col items-center justify-center flex-1 py-1 text-center transition {{ request()->routeIs('companies*') ? 'text-primary font-bold' : 'text-gray-400 hover:text-gray-700' }}">
    <i class="fa-solid fa-building text-lg mb-0.5"></i>
    <span class="text-[9px] font-semibold uppercase tracking-tight">{{ __('Companies') }}</span>
  </a>

  <!-- 3. YENİ ELAN (Center Elevated Orange Circular Button) -->
  <div class="flex flex-col items-center justify-center flex-1 relative -top-3.5">
    <a href="{{ route('jobs.create') }}" class="w-13 h-13 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center border-4 border-white transition-all transform hover:scale-105 active:scale-95" title="{{ __('Post an ad') }}">
      <i class="fa-solid fa-plus text-2xl font-black"></i>
    </a>
    <span class="text-[9px] font-semibold uppercase tracking-tight text-gray-500 mt-0.5">{{ __('Post an Ad') }}</span>
  </div>

  <!-- 4. İŞ AXTARANLAR -->
  <a href="{{ route('job-seekers.index') }}" class="flex flex-col items-center justify-center flex-1 py-1 text-center transition {{ request()->routeIs('job-seekers*') ? 'text-primary font-bold' : 'text-gray-400 hover:text-gray-700' }}">
    <i class="fa-solid fa-user-tie text-lg mb-0.5"></i>
    <span class="text-[9px] font-semibold uppercase tracking-tight truncate max-w-[68px]">{{ __('Job Seeker') }}</span>
  </a>

  <!-- 5. DAHA ÇOX -->
  <button type="button" @click="mobileDrawerOpen = true" class="flex flex-col items-center justify-center flex-1 py-1 text-center text-gray-400 hover:text-gray-700 transition cursor-pointer">
    <i class="fa-solid fa-bars text-lg mb-0.5"></i>
    <span class="text-[9px] font-semibold uppercase tracking-tight">{{ __('More') }}</span>
  </button>

</nav>
