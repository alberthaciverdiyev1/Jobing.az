@props([
    'mode' => 'bump',
    'record' => null,
])

<x-promotion-whatsapp
    :mode="$mode"
    :item-label="__('Vacancy')"
    :title="$record->title"
    :id="$record->id"
/>
