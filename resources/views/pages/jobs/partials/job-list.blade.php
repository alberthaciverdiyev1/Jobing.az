<!-- Selected categories banner (multi-select) -->
@if(!empty($selectedCategories) && $selectedCategories->isNotEmpty())
<div class="bg-orange-50/70 border border-orange-100 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
    <div>
        <span class="text-xs text-orange-950 font-bold uppercase tracking-wider block mb-1.5">{{ __('Kateqoriyalar:') }}</span>
        <div class="flex flex-wrap gap-1.5">
            @foreach($selectedCategories as $sc)
            <span class="text-xs font-semibold text-orange-900 bg-white/70 px-2 py-0.5 rounded border border-orange-100">{{ $sc->name }}</span>
            @endforeach
        </div>
    </div>
    <button type="button" @click="resetAllFilters()"
            class="text-xs text-primary font-bold hover:underline cursor-pointer shrink-0">
        {{ __('Filtrı sıfırla') }} ✕
    </button>
</div>
@endif

<!-- Job List Items -->
@if($jobs->count() > 0)
<div class="space-y-3">
    @foreach($jobs as $job)
    <x-job-card :job="$job" />
    @endforeach
</div>

<!-- Pagination -->
<div class="mt-8 flex justify-center pagination-wrapper">
    {{ $jobs->links() }}
</div>
@else
<!-- Empty State -->
<x-empty-state icon="fa-search"
               :title="__('Axtarışa uyğun vakansiya tapılmadı')"
               :description="__('Axtarış sözünü dəyişərək və ya filtrləri sıfırlayaraq yenidən cəhd edə bilərsiniz.')">
    @slot('actions')
    <button type="button" @click="resetAllFilters()"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
        <i class="fas fa-sync-alt text-xs"></i>
        <span>{{ __('Bütün filtrləri sıfırla') }}</span>
    </button>
    @endslot
</x-empty-state>
@endif
