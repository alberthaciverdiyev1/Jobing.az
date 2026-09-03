@props(['seeker'])

@php
    $isSeekerFeatured = (bool) ($seeker->is_featured ?? false);
@endphp

<div {{ $attributes->merge(['class' => ($isSeekerFeatured ? 'bg-amber-50/20 border-amber-300 hover:border-amber-400' : 'bg-white border-gray-200 hover:border-gray-300') . ' rounded-xl p-4 md:p-5 border hover:shadow-xs transition-all duration-200 group flex flex-col justify-between relative cursor-pointer']) }}>

    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

        <!-- Left: Avatar & Details -->
        <div class="flex items-start gap-4">
            <x-company-avatar :name="$seeker->contact_name" size="md" :featured="$isSeekerFeatured" />

            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-500">{{ $seeker->contact_name }}</span>
                    @if($isSeekerFeatured)
                    <x-premium-badge />
                    @endif
                    @if($seeker->position)
                    <span class="text-gray-300">•</span>
                    <span class="text-xs text-gray-500 font-medium">{{ $seeker->position }}</span>
                    @endif
                </div>

                <h3 class="text-base font-bold text-gray-900 group-hover:text-primary transition leading-tight">
                    <a href="{{ route('job-seekers.show', $seeker->slug) }}" class="focus:outline-hidden before:absolute before:inset-0">
                        {{ $seeker->title }}
                    </a>
                </h3>

                <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 pt-0.5">
                    @if($seeker->workplaceType)
                    <span>{{ $seeker->workplaceType->name }}</span>
                    @endif
                    @if($seeker->workplaceType && $seeker->jobType)
                    <span>•</span>
                    @endif
                    @if($seeker->jobType)
                    <span>{{ $seeker->jobType->name }}</span>
                    @endif
                    @if($seeker->availability)
                    <span>•</span>
                    <span class="text-emerald-600 font-medium flex items-center gap-1">
                        <i class="fas fa-bolt text-[10px]"></i>
                        {{ match($seeker->availability) {
                            'immediate' => __('Dərhal başlaya bilər'),
                            '1_week' => __('1 həftə ərzində'),
                            '2_weeks' => __('2 həftə ərzində'),
                            '1_month' => __('1 ay ərzində'),
                            default => $seeker->availability
                        } }}
                    </span>
                    @endif
                </div>
            </div>
        </div>

        <!-- Right: Location, Date & Salary (mobile: city + salary justified between) -->
        <div class="sm:text-right shrink-0 flex flex-col sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
            <div class="flex items-center justify-between sm:justify-end gap-3 text-xs w-full sm:w-auto">
                <div class="font-medium text-gray-700 flex items-center gap-1.5">
                    <i class="fas fa-map-marker-alt text-primary text-xs"></i>
                    <span>{{ $seeker->location ?: __('Bakı, Azərbaycan') }}</span>
                </div>
                <span class="sm:hidden text-sm font-bold text-gray-900 font-mono">{{ $seeker->formatted_salary }}</span>
            </div>
            <div class="text-gray-400 text-[11px] mt-0.5 sm:mt-0">{{ $seeker->created_at?->diffForHumans() }}</div>
        </div>

    </div>

    <!-- Footer: Skills & Salary (exact match to job-card) -->
    <div class="hidden sm:flex mt-3 pt-3 border-t border-gray-100 items-center justify-between gap-2">
        <x-skill-tags :skills="$seeker->skills" />
        <span class="text-sm font-bold text-gray-900 font-mono sm:ml-auto">{{ $seeker->formatted_salary }}</span>
    </div>

</div>
