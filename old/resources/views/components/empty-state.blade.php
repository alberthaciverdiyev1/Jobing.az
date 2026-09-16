@props([
    'icon' => 'fa-search',
    'title' => '',
    'description' => '',
    'tight' => false,
])

<div {{ $attributes->merge(['class' => 'text-center py-16 bg-white ' . ($tight ? 'rounded-xl' : 'rounded-2xl') . ' border border-gray-200 p-8 shadow-2xs' . ($tight ? '' : ' max-w-lg mx-auto')]) }}>
    <div class="{{ $tight ? 'w-14 h-14 text-xl rounded-xl' : 'w-16 h-16 text-2xl rounded-2xl' }} bg-orange-50 text-primary flex items-center justify-center mx-auto mb-4 border border-orange-100">
        <i class="fas {{ $icon }}"></i>
    </div>
    <h3 class="text-base font-bold text-gray-900 mb-1">{{ $title }}</h3>
    <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">{{ $description }}</p>
    @isset($actions)
        {{ $actions }}
    @endisset
</div>
