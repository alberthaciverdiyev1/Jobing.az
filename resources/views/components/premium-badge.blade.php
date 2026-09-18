@props(['text' => __('PREMIUM')])

<span {{ $attributes->merge(['class' => 'text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-amber-500 text-white flex items-center gap-1 shadow-2xs']) }}>
    <i class="fas fa-crown text-[10px]"></i>
    <span class="hidden sm:inline">{{ $text }}</span>
</span>
