@props(['job'])

@php
    $isFeatured = (bool) ($job->is_featured ?? false);
@endphp

<div {{ $attributes->merge(['class' => ($isFeatured ? 'bg-amber-50/20 border-amber-300 hover:border-amber-400' : 'bg-white border-gray-200 hover:border-gray-300') . ' rounded-xl p-4 md:p-5 border hover:shadow-xs transition-all duration-200 group flex flex-col justify-between relative']) }}>
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

        <!-- Left: Logo & Details -->
        <div class="flex items-start gap-4">
            <x-company-avatar :name="$job->company?->name" :logo="$job->company?->logo" :featured="$isFeatured" size="md" />
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-500">{{ $job->company->name ?? '' }}</span>
                    @if($isFeatured)
                    <x-premium-badge />
                    @endif

                    @if(auth()->check() && in_array($job->id, auth()->user()->appliedVacancyIds(), true))
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <i class="fas fa-check text-[9px]"></i>
                        <span>{{ __('Müraciət edilib') }}</span>
                    </span>
                    @endif
                </div>
                <h3 class="text-base font-bold text-gray-900 group-hover:text-primary transition leading-tight">
                    <a href="{{ route('jobs.show', $job->slug) }}" class="focus:outline-hidden before:absolute before:inset-0">
                        {{ $job->title }}
                    </a>
                </h3>
                <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 pt-0.5">
                    @if($job->workplace_type_name)
                    <span>{{ $job->workplace_type_name }}</span>
                    @endif
                    @if($job->workplace_type_name && $job->job_type_name)
                    <span>•</span>
                    @endif
                    @if($job->job_type_name)
                    <span>{{ $job->job_type_name }}</span>
                    @endif
                </div>
            </div>
        </div>

        <!-- Right: Location, Date & Salary (mobile: city + salary justified between) -->
        <div class="sm:text-right shrink-0 flex flex-col sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
            <div class="flex items-center justify-between sm:justify-end gap-3 text-xs w-full sm:w-auto">
                <div class="font-medium text-gray-700 flex items-center gap-1.5">
                    <i class="fas fa-map-marker-alt text-primary text-xs"></i>
                    <span>{{ $job->city_name ?: ($job->company?->location ?? '') }}</span>
                </div>
                <span class="sm:hidden text-sm font-bold text-gray-900 font-mono">{{ $job->formatted_salary }}</span>
            </div>
            <div class="text-gray-400 text-[11px] mt-0.5 sm:mt-0">{{ $job->created_at?->diffForHumans() }}</div>
        </div>

    </div>

    <!-- Footer: Skills & Salary (desktop only, so tags are hidden on mobile) -->
    <div class="hidden sm:flex mt-3 pt-3 border-t border-gray-100 items-center justify-between gap-2">
        <x-skill-tags :skills="$job->skills" />
        <span class="text-sm font-bold text-gray-900 font-mono sm:ml-auto">{{ $job->formatted_salary }}</span>
    </div>
</div>
