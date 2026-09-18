<x-filament-panels::page>
    <form wire:submit="save" class="space-y-6">
        {{ $this->form }}

        <x-filament::button type="submit" size="lg">
            {{ __('Yadda Saxla') }}
        </x-filament::button>
    </form>
</x-filament-panels::page>
