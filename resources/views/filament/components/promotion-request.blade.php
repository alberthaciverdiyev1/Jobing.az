@props([
    'mode' => 'bump',
    'record' => null,
])

{{-- Company panel: package selection + WhatsApp request, same component the public site uses. --}}
<x-promotion-whatsapp
    :mode="$mode"
    :item-label="__('Vacancy')"
    :title="$record->title"
    :id="$record->id"
/>
