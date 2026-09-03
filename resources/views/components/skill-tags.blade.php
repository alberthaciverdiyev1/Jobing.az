@props(['skills' => [], 'limit' => 4])

@php
    $skillsList = is_array($skills) ? $skills : (is_string($skills) && trim($skills) !== '' ? array_map('trim', explode(',', $skills)) : []);
@endphp

@if(!empty($skillsList) && count($skillsList) > 0)
<div {{ $attributes->merge(['class' => 'flex flex-wrap gap-1.5']) }}>
    @foreach(array_slice($skillsList, 0, $limit) as $skill)
        <span class="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[11px] border border-gray-100 font-medium font-mono">{{ $skill }}</span>
    @endforeach
    @if(count($skillsList) > $limit)
        <span class="px-1.5 py-0.5 text-gray-400 text-[10px] font-mono">+{{ count($skillsList) - $limit }}</span>
    @endif
</div>
@endif
