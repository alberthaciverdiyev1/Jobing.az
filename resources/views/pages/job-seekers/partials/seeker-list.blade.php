<!-- Candidate Cards List -->
@if($jobSeekers->count() > 0)
<div class="space-y-3">
    @foreach($jobSeekers as $seeker)
    <x-candidate-card :seeker="$seeker" />
    @endforeach
</div>

<!-- Pagination -->
<div class="mt-8 pagination-wrapper">
    {{ $jobSeekers->links() }}
</div>

@else
<!-- Empty State -->
<x-empty-state icon="fa-user-tie" :tight="true"
               :title="__('No candidate listings matching your search')"
               :description="__('Try again by changing your search criteria or resetting the filters.')">
    @slot('actions')
    <div class="flex items-center gap-2">
        <button type="button"
                @click="resetAllFilters()"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer">
            <i class="fas fa-sync-alt text-xs"></i>
            <span>{{ __('Reset filters') }}</span>
        </button>
        @if(!auth()->check() || !auth()->user()->isCompany())
        <a href="{{ route('job-seekers.create') }}"
           class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
            <i class="fas fa-plus text-xs"></i>
            <span>{{ __('Post your first ad') }}</span>
        </a>
        @endif
    </div>
    @endslot
</x-empty-state>
@endif
