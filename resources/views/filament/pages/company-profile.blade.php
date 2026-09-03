<x-filament-panels::page>
    @php $company = auth()->user()->company; @endphp

    {{-- Verification status --}}
    <div class="rounded-xl border p-4 @if($company->is_verified) border-emerald-200 bg-emerald-50 text-emerald-800 @elseif($company->verification_requested) border-amber-200 bg-amber-50 text-amber-800 @else border-gray-200 bg-gray-50 text-gray-700 @endif flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-sm font-semibold">
            @if($company->is_verified)
                <x-filament::icon icon="heroicon-m-check-badge" class="h-5 w-5" />
                <span>{{ __('Şirkətiniz təsdiqlənmişdir ✓') }}</span>
            @elseif($company->verification_requested)
                <x-filament::icon icon="heroicon-m-clock" class="h-5 w-5" />
                <span>{{ __('Doğrulama sorğusu göndərilib — admin tərəfindən nəzərdən keçirilir.') }}</span>
            @else
                <x-filament::icon icon="heroicon-m-shield-exclamation" class="h-5 w-5" />
                <span>{{ __('Şirkətiniz hələ təsdiqlənməyib.') }}</span>
            @endif
        </div>

        @if(!$company->is_verified && !$company->verification_requested)
            <x-filament::button wire:click="requestVerification" color="primary" size="sm">
                {{ __('Doğrulama İstə') }}
            </x-filament::button>
        @endif
    </div>

    <form wire:submit="save" class="space-y-6">
        {{ $this->form }}

        <x-filament::button type="submit">
            {{ __('Yadda saxla') }}
        </x-filament::button>
    </form>
</x-filament-panels::page>
