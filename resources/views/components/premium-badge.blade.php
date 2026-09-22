@props(['text' => __('PREMIUM')])

<span {{ $attributes->merge(['class' => 'w-7 h-7 sm:w-auto sm:h-auto text-[11px] font-semibold px-0 sm:px-2 py-0 sm:py-0.5 rounded-lg sm:rounded bg-amber-500 text-white flex items-center justify-center gap-1 shadow-2xs']) }}>
    <i class="fas fa-crown text-sm sm:text-[10px]"></i>
    <span class="hidden sm:inline">{{ $text }}</span>
</span>
