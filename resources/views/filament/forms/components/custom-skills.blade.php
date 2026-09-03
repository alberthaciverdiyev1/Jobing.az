<div x-data="{
    state: $wire.entangle('{{ $getStatePath() }}'),
    init() {
        if (!Array.isArray(this.state)) this.state = [];
    },
    addItem() {
        if (!Array.isArray(this.state)) this.state = [];
        this.state.push({ skill: '', level: 'advanced' });
    },
    removeItem(index) {
        this.state.splice(index, 1);
    }
}" class="space-y-4 w-full">
    <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Bacarıqlar</span>
        <x-filament::button type="button" size="xs" color="warning" icon="heroicon-m-plus" x-on:click="addItem()">
            Bacarıq Əlavə Et
        </x-filament::button>
    </div>

    <div class="space-y-3">
        <template x-for="(item, index) in state" :key="index">
            <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-800/50">
                <div class="flex-1 space-y-1">
                    <label class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Bacarıq Adı</label>
                    <x-filament::input.wrapper>
                        <select x-model="item.skill" class="w-full text-xs bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white py-2">
                            <option value="">-- Bacarıq seçin --</option>
                            @foreach($getViewData()['skillOptions'] as $sk)
                                <option value="{{ $sk->name }}">{{ $sk->name }}</option>
                            @endforeach
                        </select>
                    </x-filament::input.wrapper>
                </div>
                <div class="w-40 space-y-1">
                    <label class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Səviyyə</label>
                    <x-filament::input.wrapper>
                        <select x-model="item.level" class="w-full text-xs bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white py-2">
                            <option value="beginner">Başlanğıc</option>
                            <option value="intermediate">Orta</option>
                            <option value="advanced">Yüksək</option>
                            <option value="expert">Mütəxəssis</option>
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
        <p class="text-xs font-medium text-gray-400">Bacarıq əlavə olunmayıb</p>
    </div>
</div>
