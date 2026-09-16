@props([
    'name' => '',
    'logo' => null,
    'size' => 'md', // sm | md | lg | xl
    'featured' => false,
    'border' => null,
])

@php
    $sizes = [
        'sm' => 'w-8 h-8 text-sm rounded-lg',
        'md' => 'w-12 h-12 text-lg rounded-xl',
        'lg' => 'w-13 h-13 text-xl rounded-xl',
        'xl' => 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-2xl',
    ];
    $boxClass = $sizes[$size] ?? $sizes['md'];
    $bg = $featured ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white';
@endphp

<div {{ $attributes->merge(['class' => $boxClass . ' ' . $bg . ' border flex items-center justify-center font-bold shrink-0 overflow-hidden' . ($border ?: ' border-gray-100')]) }}>
    @if($logo)
        <img src="{{ asset('storage/' . $logo) }}" alt="{{ $name }}" class="w-full h-full object-cover">
    @else
        {{ mb_substr($name ?: 'J', 0, 1) }}
    @endif
</div>
