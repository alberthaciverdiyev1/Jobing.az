<div x-data="{
    state: $wire.entangle('{{ $getStatePath() }}'),
    init() {
        if (!Array.isArray(this.state)) this.state = [];
    },
    addItem() {
        if (!Array.isArray(this.state)) this.state = [];
        this.state.push({ name: '', role: '', technologies: '', github_url: '', demo_url: '', description: '' });
    },
    removeItem(index) {
        this.state.splice(index, 1);
    }
}" class="space-y-4 w-full">
    <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Layihələr Siyahısı</span>
        <x-filament::button type="button" size="xs" color="warning" icon="heroicon-m-plus" x-on:click="addItem()">
            Layihə Əlavə Et
        </x-filament::button>
    </div>

    <template x-for="(item, index) in state" :key="index">
        <div class="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/50 space-y-4">
            <div class="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-2.5">
                <span class="text-xs font-extrabold text-orange-600 dark:text-orange-400" x-text="(index + 1) + '. Layihə' + (item.name ? ' (' + item.name + ')' : '')"></span>
                <x-filament::button type="button" size="xs" color="danger" icon="heroicon-m-trash" x-on:click="removeItem(index)">
                    Sil
                </x-filament::button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div class="space-y-1.5">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Layihə Adı *</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.name" placeholder="Örn: Jobing Portal" />
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Rolunuz</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.role" placeholder="Örn: Lead Developer" />
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5 md:col-span-2">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Texnologiyalar</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.technologies" placeholder="Örn: Laravel, Vue.js, Tailwind CSS" />
                    </x-filament::input.wrapper>
                </div>
            </div>
        </div>
    </template>

    <div x-show="!state || state.length === 0" class="text-center py-5 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
        <p class="text-xs font-medium text-gray-400">Layihə əlavə olunmayıb</p>
    </div>
</div>
