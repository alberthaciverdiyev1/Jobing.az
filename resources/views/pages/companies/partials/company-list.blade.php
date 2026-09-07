@if($companies->count() > 0)
<!-- Companies Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    @foreach($companies as $company)
    <x-company-card :company="$company" />
    @endforeach
</div>

<!-- Pagination -->
<div class="mt-10 pagination-wrapper">
    {{ $companies->links() }}
</div>

@else
<!-- Empty State -->
<x-empty-state icon="fa-building"
               :title="__('Axtarışa uyğun şirkət tapılmadı')"
               :description="__('Axtarış sözünü dəyişərək və ya tətbiq etdiyiniz filtrləri sıfırlayaraq yenidən cəhd edə bilərsiniz.')">
    @slot('actions')
    <button type="button"
            @click="resetAllFilters()"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
        <i class="fas fa-sync-alt text-xs"></i>
        <span>{{ __('Bütün filtrləri sıfırla') }}</span>
    </button>
    @endslot
</x-empty-state>
@endif
