<nav id="mobileBottomNav" class="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/90 px-2 flex items-center justify-around select-none h-16 shadow-lg">

  <!-- 1. VAKANSİYALAR -->
  <a href="{{ route('jobs.index') }}" class="flex flex-col items-center justify-center flex-1 py-1 text-center transition {{ request()->routeIs('jobs.index') || request()->routeIs('jobs.index') ? 'text-primary font-semibold' : 'text-gray-400 hover:text-gray-700' }}">
    <i class="fa-solid fa-briefcase text-xl mb-0.5"></i>
    <span class="text-[12px] font-semibold">{{ __('Vacancies') }}</span>
  </a>

  <!-- 2. ŞİRKƏTLƏR -->
  <a href="{{ route('companies.index') }}" class="flex flex-col items-center justify-center flex-1 py-1 text-center transition {{ request()->routeIs('companies*') ? 'text-primary font-semibold' : 'text-gray-400 hover:text-gray-700' }}">
    <i class="fa-solid fa-building text-xl mb-0.5"></i>
    <span class="text-[12px] font-semibold">{{ __('Companies') }}</span>
  </a>

  <!-- 3. YENİ ELAN (Center Elevated Orange Circular Button) -->
  <div class="flex flex-col items-center justify-center flex-1 relative -top-3.5">
    <a href="{{ route('jobs.create') }}" class="w-13 h-13 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center border-4 border-white transition-all transform hover:scale-105 active:scale-95" title="{{ __('Post an ad') }}">
      <i class="fa-solid fa-plus text-2xl font-semibold"></i>
    </a>
    <span class="text-[12px] font-semibold text-gray-500 mt-0.5">{{ __('Post an Ad') }}</span>
  </div>

  <!-- 4. İŞ AXTARANLAR -->
  <a href="{{ route('job-seekers.index') }}" class="flex flex-col items-center justify-center flex-1 py-1 text-center transition {{ request()->routeIs('job-seekers*') ? 'text-primary font-semibold' : 'text-gray-400 hover:text-gray-700' }}">
    <i class="fa-solid fa-user-tie text-xl mb-0.5"></i>
    <span class="text-[12px] font-semibold truncate max-w-[68px]">{{ __('Job Seeker') }}</span>
  </a>

  <!-- 5. DAHA ÇOX -->
  <button type="button" @click="mobileDrawerOpen = true" class="flex flex-col items-center justify-center flex-1 py-1 text-center text-gray-400 hover:text-gray-700 transition cursor-pointer">
    <i class="fa-solid fa-bars text-xl mb-0.5"></i>
    <span class="text-[12px] font-semibold">{{ __('More') }}</span>
  </button>

</nav>
