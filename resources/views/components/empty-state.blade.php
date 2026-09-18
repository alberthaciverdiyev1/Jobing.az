@props([
    'icon' => 'fa-search',
    'title' => '',
    'description' => '',
    'tight' => false,
])

<div {{ $attributes->merge(['class' => 'text-center py-16 bg-white border border-gray-200 p-8' . ($tight ? '' : ' max-w-lg mx-auto')]) }}>
    <i class="fas {{ $icon }} text-2xl text-gray-300 mb-4 block"></i>
    <h3 class="text-base font-semibold text-gray-900 mb-1">{{ $title }}</h3>
    <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">{{ $description }}</p>
    @isset($actions)
        {{ $actions }}
    @endisset
</div>
