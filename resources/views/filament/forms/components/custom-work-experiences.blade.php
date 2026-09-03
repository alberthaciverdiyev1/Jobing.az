<div x-data="{
    state: $wire.entangle('{{ $getStatePath() }}'),
    init() {
        if (!Array.isArray(this.state)) this.state = [];
    },
    addItem() {
        if (!Array.isArray(this.state)) this.state = [];
        this.state.push({ company: '', position: '', work_type: 'full_time', start_date: '', end_date: '', is_current: false, description: '' });
    },
    removeItem(index) {
        this.state.splice(index, 1);
    }
}" class="space-y-4 w-full">
    <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-gray-500 dark:text-gray-400">İş Yerləri Siyahısı</span>
        <x-filament::button type="button" size="xs" color="warning" icon="heroicon-m-plus" x-on:click="addItem()">
            İş Yeri Əlavə Et
        </x-filament::button>
    </div>

    <template x-for="(item, index) in state" :key="index">
        <div class="p-4 rounded-xl bg-gray-50/70 dark:bg-gray-800/50 space-y-4">
            <div class="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-2.5">
                <span class="text-xs font-extrabold text-orange-600 dark:text-orange-400" x-text="(index + 1) + '. İş Yeri' + (item.company ? ' (' + item.company + ')' : '')"></span>
                <x-filament::button type="button" size="xs" color="danger" icon="heroicon-m-trash" x-on:click="removeItem(index)">
                    Sil
                </x-filament::button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div class="space-y-1.5">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Şirkət Adı *</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.company" placeholder="Örn: FoxSoft MMC" />
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Vəzifə / Pozisiya *</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="text" x-model="item.position" placeholder="Örn: Senior Software Engineer" />
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">İş Rejimi</label>
                    <x-filament::input.wrapper>
                        <select x-model="item.work_type" class="w-full text-xs bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white py-2">
                            <option value="full_time">Tam zamanlı</option>
                            <option value="part_time">Yarı zamanlı</option>
                            <option value="contract">Müqaviləli</option>
                            <option value="freelance">Frilans</option>
                            <option value="internship">Təcrübəçi (Intern)</option>
                        </select>
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5 flex items-end pb-2">
                    <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300 font-semibold">
                        <input type="checkbox" x-model="item.is_current" class="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4">
                        <span>Hələ də burada çalışıram (Cari İş Yeri)</span>
                    </label>
                </div>

                <div class="space-y-1.5">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Başlanğıc Tarixi</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="date" x-model="item.start_date" />
                    </x-filament::input.wrapper>
                </div>

                <div class="space-y-1.5" x-show="!item.is_current">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Bitiş Tarixi</label>
                    <x-filament::input.wrapper>
                        <x-filament::input type="date" x-model="item.end_date" />
                    </x-filament::input.wrapper>
                </div>

                <div class="md:col-span-2 space-y-1.5">
                    <label class="font-bold text-gray-700 dark:text-gray-300 block">Öhdəliklər & Əldə Olunan Nəticələr</label>
                    <x-filament::input.wrapper>
                        <textarea x-model="item.description" rows="3" placeholder="Vəzifə öhdəlikləriniz və yerinə yetirdiyiniz işlər haqqında qısa məlumat..." class="w-full text-xs bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white p-2.5 leading-relaxed"></textarea>
                    </x-filament::input.wrapper>
                </div>
            </div>
        </div>
    </template>

    <div x-show="!state || state.length === 0" class="text-center py-5 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
        <p class="text-xs font-medium text-gray-400">Hələ ki iş təcrübəsi əlavə olunmayıb</p>
    </div>
</div>
