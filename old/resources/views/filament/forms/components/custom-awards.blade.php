<div x-data="{
    state: $wire.entangle('{{ $getStatePath() }}'),
    init() {
        if (!Array.isArray(this.state)) this.state = [];
    },
    addItem() {
        if (!Array.isArray(this.state)) this.state = [];
        this.state.push({ title: '', issuer: '', date: '', description: '' });
    },
    removeItem(index) {
        this.state.splice(index, 1);
    }
}" class="space-y-4 w-full">
    <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Ödüllər & Nailiyyətlər</span>
        <x-filament::button type="button" size="xs" color="warning" icon="heroicon-m-plus" x-on:click="addItem()">
            Ödül Əlavə Et
        </x-filament::button>
    </div>

    <template x-for="(item, index) in state" :key="index">
        <div class="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/50 space-y-3">
            <div class="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-2">
                <span class="text-xs font-extrabold text-orange-600 dark:text-orange-400" x-text="(index + 1) + '. Nailiyyət'"></span>
                <x-filament::button type="button" size="xs" color="danger" icon="heroicon-m-trash" x-on:click="removeItem(index)">
                    Sil
                </x-filament::button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="space-y-1">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Nailiyyət / Ödül Adı *</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.title" placeholder="Best Developer 2025" />
                    </x-filament::input.wrapper>
                </div>
                <div class="space-y-1">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Təşkilat</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.issuer" placeholder="Təşkilat adı" />
                    </x-filament::input.wrapper>
                </div>
            </div>
        </div>
    </template>

    <div x-show="!state || state.length === 0" class="text-center py-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
        <p class="text-xs font-medium text-gray-400">Nailiyyət əlavə olunmayıb</p>
    </div>
</div>
