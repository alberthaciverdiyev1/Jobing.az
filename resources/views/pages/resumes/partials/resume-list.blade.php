@php
    $activeSkills = (array) request('skills', []);
@endphp

@if(!empty($activeSkills))
<div class="bg-orange-50/70 border border-orange-100 rounded-xl p-3.5 mb-5 flex items-center justify-between gap-3">
    <div>
        <span class="text-xs text-orange-950 font-bold uppercase tracking-wider block mb-1">{{ __('Selected skills:') }}</span>
        <div class="flex flex-wrap gap-1.5">
            @foreach($activeSkills as $ask)
            <span class="text-xs font-semibold text-orange-900 bg-white/80 px-2 py-0.5 rounded border border-orange-200/60 inline-flex items-center gap-1.5">
                <span>{{ $ask }}</span>
                <button type="button" @click="toggleSkill('{{ addslashes($ask) }}')" class="text-orange-400 hover:text-orange-700 cursor-pointer text-[10px]">✕</button>
            </span>
            @endforeach
        </div>
    </div>
    <button type="button" @click="clearSkills()"
            class="text-xs text-primary font-bold hover:underline cursor-pointer shrink-0">
        {{ __('Clear') }}
    </button>
</div>
@endif

<!-- Resumes Grid (3 cards per row) -->
@if($resumes->count() > 0)
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    @foreach($resumes as $resume)
    <div class="bg-white rounded-2xl p-5 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between relative cursor-pointer">

        <div>
            <!-- Top: Avatar + Name, Position & Location side by side -->
            <div class="flex items-start gap-3.5">
                <div class="w-13 h-13 rounded-xl bg-slate-900 border border-gray-100 flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-2xs overflow-hidden">
                    @if($resume->photo)
                    <img src="{{ asset('storage/' . $resume->photo) }}" alt="{{ $resume->full_name }}" class="w-full h-full object-cover">
                    @else
                    {{ mb_substr($resume->first_name ?: 'C', 0, 1) }}{{ mb_substr($resume->last_name ?: 'V', 0, 1) }}
                    @endif
                </div>

                <div class="min-w-0 flex-1">
                    <h3 class="text-base font-bold text-gray-900 group-hover:text-primary transition leading-tight truncate">
                        <a href="{{ route('resumes.show', $resume->id) }}" target="_blank" class="focus:outline-hidden before:absolute before:inset-0">
                            {{ $resume->title ?: __('Specialist') }}
                        </a>
                    </h3>

                    <p class="text-xs font-semibold text-primary truncate mt-1">
                        {{ $resume->full_name }}
                    </p>
                </div>
            </div>

            <!-- Skills Tags -->
            <div class="flex flex-wrap items-center gap-1.5 mt-3.5">
                @if(!empty($resume->skills) && is_array($resume->skills))
                    @php
                        $skillList = array_slice($resume->skills, 0, 3);
                    @endphp
                    @foreach($skillList as $skItem)
                    @php
                        $skTitle = is_array($skItem) ? ($skItem['skill'] ?? '') : $skItem;
                    @endphp
                    @if($skTitle)
                    <span class="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium">
                        {{ $skTitle }}
                    </span>
                    @endif
                    @endforeach
                    @if(count($resume->skills) > 3)
                    <span class="text-[10px] text-gray-400 font-mono">+{{ count($resume->skills) - 3 }}</span>
                    @endif
                @endif
            </div>
        </div>

        <!-- Card Bottom: Date & View CTA -->
        <div class="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-[11px] text-gray-400 flex items-center gap-1">
                <i class="far fa-clock text-[10px]"></i>
                <span>{{ $resume->updated_at ? $resume->updated_at->diffForHumans() : '' }}</span>
            </span>

            <span class="text-primary group-hover:text-primary-dark font-bold flex items-center gap-1 transition text-xs">
                <span>{{ __('View CV') }}</span>
                <i class="fas fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
            </span>
        </div>

    </div>
    @endforeach
</div>

<!-- Pagination -->
<div class="mt-8 pagination-wrapper">
    {{ $resumes->links() }}
</div>

@else
<!-- Empty State -->
<div class="text-center py-16 bg-white rounded-xl border border-gray-200 p-8 shadow-2xs">
    <div class="w-14 h-14 bg-orange-50 text-primary rounded-xl flex items-center justify-center mx-auto mb-3 border border-orange-100">
        <i class="fas fa-file-alt text-xl"></i>
    </div>
    <h3 class="text-base font-bold text-gray-900 mb-1">{{ __('No resumes matching your search') }}</h3>
    <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5">
        {{ __('Try again by changing your search criteria or resetting the filters.') }}
    </p>
    <button type="button"
            @click="resetAllFilters()"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
        <i class="fas fa-sync-alt text-xs"></i>
        <span>{{ __('Reset all filters') }}</span>
    </button>
</div>
@endif
