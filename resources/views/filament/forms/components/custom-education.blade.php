<div x-data="{
    state: $wire.entangle('{{ $getStatePath() }}'),
    init() {
        if (!Array.isArray(this.state)) this.state = [];
    },
    addItem() {
        if (!Array.isArray(this.state)) this.state = [];
        this.state.push({ institution: '', field_of_study: '', degree: 'bachelor', start_date: '', end_date: '', is_current: false });
    },
    removeItem(index) {
        this.state.splice(index, 1);
    }
}" class="space-y-4 w-full">
    <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ __('Education List') }}</span>
        <x-filament::button type="button" size="xs" color="warning" icon="heroicon-m-plus" x-on:click="addItem()">
            Təhsil Əlavə Et
        </x-filament::button>
    </div>

    <template x-for="(item, index) in state" :key="index">
        <div class="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/50 space-y-4">
            <div class="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-2.5">
                <span class="text-xs font-semibold text-orange-600 dark:text-orange-400" x-text="(index + 1) + '. Təhsil' + (item.institution ? ' (' + item.institution + ')' : '')"></span>
                <x-filament::button type="button" size="xs" color="danger" icon="heroicon-m-trash" x-on:click="removeItem(index)">
                    Sil
                </x-filament::button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div class="space-y-1.5">
                    <label class="font-semibold text-gray-700 dark:text-gray-300 block">{{ __('University / College *') }}</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.institution" placeholder="Örn: Doğu Akdeniz Üniversitesi" />
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5">
                    <label class="font-semibold text-gray-700 dark:text-gray-300 block">{{ __('Major / Department *') }}</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.field_of_study" placeholder="Örn: Kompüter Elmləri" />
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5">
                    <label class="font-semibold text-gray-700 dark:text-gray-300 block">{{ __('Degree') }}</label>
                    <x-filament::input.wrapper>
                        <select x-model="item.degree" class="w-full text-xs bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white py-2">
                            <option value="bachelor">{{ __('Bachelor') }}</option>
                            <option value="master">{{ __('Master') }}</option>
                            <option value="phd">{{ __('Doctorate (PhD)') }}</option>
                            <option value="associate">{{ __('College / Associate') }}</option>
                            <option value="high_school">{{ __('High School') }}</option>
                        </select>
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5 flex items-end pb-2">
                    <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300 font-semibold">
                        <input type="checkbox" x-model="item.is_current" class="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4">
                        <span>{{ __('I am continuing my education') }}</span>
                    </label>
                </div>

                <div class="space-y-1.5">
                    <label class="font-semibold text-gray-700 dark:text-gray-300 block">{{ __('Start Date') }}</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="date" x-model="item.start_date" />
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5" x-show="!item.is_current">
                    <label class="font-semibold text-gray-700 dark:text-gray-300 block">{{ __('End Date') }}</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="date" x-model="item.end_date" />
                    </x-filament::input.wrapper>
                </div>
            </div>
        </div>
    </template>

    <div x-show="!state || state.length === 0" class="text-center py-5 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
        <p class="text-xs font-medium text-gray-400">{{ __('No education added yet') }}</p>
    </div>
</div>
