@if(!empty($selectedCategories) && $selectedCategories->isNotEmpty())
<div class="bg-orange-50/70 border border-orange-100 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
    <div>
        <span class="text-xs text-gray-700 font-medium block mb-1.5">{{ __('Categories:') }}</span>
        <div class="flex flex-wrap gap-1.5">
            @foreach($selectedCategories as $sc)
            <span class="text-xs font-semibold text-gray-800 bg-white/70 px-2 py-0.5 rounded border border-orange-100">{{ $sc->name }}</span>
            @endforeach
        </div>
    </div>
    <button type="button" @click="resetAllFilters()"
            class="text-xs text-primary font-semibold hover:underline cursor-pointer shrink-0">
        {{ __('Reset filter') }} ✕
    </button>
</div>
@endif

@if($jobs->count() > 0)
<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    @foreach($jobs as $job)
    <x-job-card :job="$job" />
    @endforeach
</div>

<div class="mt-8 flex justify-center pagination-wrapper">
    {{ $jobs->links() }}
</div>
@else
<x-empty-state icon="fa-search"
               :title="__('No vacancies matching your search')"
               :description="__('You can try again by changing your search term or resetting filters.')">
    @slot('actions')
    <div class="flex flex-col items-center gap-3">
        <button type="button" @click="resetAllFilters()"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition shadow-xs cursor-pointer">
            <i class="fas fa-sync-alt text-xs"></i>
            <span>{{ __('Reset all filters') }}</span>
        </button>

        @unless($isExternal ?? false)
        <div class="pt-1" data-external-listing-suggestion>
            <p class="text-xs text-gray-400 mb-2">{{ __('You can also browse vacancies from other sites from here.') }}</p>
            <a href="{{ route('jobs.external') }}"
               class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-primary hover:text-primary text-gray-700 text-xs font-semibold transition cursor-pointer">
                <i class="fas fa-globe text-xs text-primary"></i>
                <span>{{ __('From other sites') }}</span>
            </a>
        </div>
        @endunless
    </div>
    @endslot
</x-empty-state>
@endif
