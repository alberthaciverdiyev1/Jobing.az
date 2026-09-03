<x-filament-panels::page>
    <form wire:submit="save" class="space-y-6">
        {{ $this->form }}

        <x-filament::button type="submit">
            {{ __('Yadda saxla') }}
        </x-filament::button>
    </form>
</x-filament-panels::page>
