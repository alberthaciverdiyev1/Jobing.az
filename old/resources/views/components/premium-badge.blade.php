@props(['text' => __('PREMIUM')])

<span {{ $attributes->merge(['class' => 'text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500 text-white flex items-center gap-1 shadow-2xs']) }}>
    <i class="fas fa-crown text-[9px]"></i>
    <span>{{ $text }}</span>
</span>
