@php
    $languageOptions = \App\Enums\LanguageEnum::options();
@endphp

<div x-data="{
    state: $wire.entangle('{{ $getStatePath() }}'),
    init() {
        if (!Array.isArray(this.state)) this.state = [];
    },
    addItem() {
        if (!Array.isArray(this.state)) this.state = [];
        this.state.push({ language: 'English', level: 'fluent' });
    },
    removeItem(index) {
        this.state.splice(index, 1);
    }
}" class="space-y-4 w-full">
    <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ __('Foreign Languages') }}</span>
        <x-filament::button type="button" size="xs" color="warning" icon="heroicon-m-plus" x-on:click="addItem()">
            Dil Əlavə Et
        </x-filament::button>
    </div>

    <div class="space-y-3">
        <template x-for="(item, index) in state" :key="index">
            <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/50">
                <div class="flex-1 space-y-1">
                    <label class="text-[12px] font-semibold text-gray-500 dark:text-gray-400 block">{{ __('Select Language') }}</label>
                    <x-filament::input.wrapper>
                        <select x-model="item.language" class="w-full text-xs bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white py-2">
                            <option value="">-- Dil seçin --</option>
                            @foreach($languageOptions as $val => $lbl)
                                <option value="{{ $val }}">{{ $lbl }}</option>
                            @endforeach
                        </select>
                    </x-filament::input.wrapper>
                </div>
                <div class="w-40 space-y-1">
                    <label class="text-[12px] font-semibold text-gray-500 dark:text-gray-400 block">{{ __('Level') }}</label>
                    <x-filament::input.wrapper>
                        <select x-model="item.level" class="w-full text-xs bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white py-2">
                            <option value="native">{{ __('Native language') }}</option>
                            <option value="fluent">{{ __('Fluent (C1-C2)') }}</option>
                            <option value="intermediate">{{ __('Intermediate (B1-B2)') }}</option>
                            <option value="basic">{{ __('Beginner (A1-A2)') }}</option>
                        </select>
                    </x-filament::input.wrapper>
                </div>
                <div class="pt-5">
                    <x-filament::button type="button" size="xs" color="danger" icon="heroicon-m-trash" x-on:click="removeItem(index)">
                        Sil
                    </x-filament::button>
                </div>
            </div>
        </template>
    </div>

    <div x-show="!state || state.length === 0" class="text-center py-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
        <p class="text-xs font-medium text-gray-400">{{ __('No language added') }}</p>
    </div>
</div>
