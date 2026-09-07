<div class="flex items-center me-2">
    <a href="{{ url('/') }}"
       target="_blank"
       title="{{ __('Veb-sayta bax') }}"
       class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-orange-600 bg-gray-100 hover:bg-gray-200/90 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 rounded-lg transition border border-gray-200/70 dark:border-gray-700 shadow-2xs">
        <x-heroicon-o-globe-alt class="w-4 h-4 text-orange-500 shrink-0" />
        <span class="hidden sm:inline font-medium">{{ __('Sayta bax') }}</span>
        <x-heroicon-m-arrow-top-right-on-square class="w-3.5 h-3.5 text-gray-400 shrink-0" />
    </a>
</div>
