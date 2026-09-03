@props(['company'])

<div {{ $attributes->merge(['class' => 'bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 p-5 md:p-6 flex flex-col justify-between group relative cursor-pointer']) }}>

    <div>
        <!-- Top: Avatar + Vacancies Counter -->
        <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3.5">
                <x-company-avatar :name="$company->name" :logo="$company->logo" size="lg" />

                <div class="min-w-0">
                    <h3 class="font-bold text-gray-900 group-hover:text-primary text-base transition flex items-center gap-1.5 leading-tight truncate">
                        <a href="{{ route('companies.show', $company->slug) }}" class="focus:outline-hidden before:absolute before:inset-0 truncate">
                            {{ $company->name }}
                        </a>
                        @if($company->is_verified)
                        <x-verified-badge class="shrink-0" />
                        @endif
                    </h3>
                    <span class="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                        <i class="fas fa-map-marker-alt text-gray-400 text-[11px]"></i>
                        <span>{{ $company->city_name ?: __('Bakı, Azərbaycan') }}</span>
                    </span>
                </div>
            </div>

            <!-- Vacancy Count Pill -->
            @if($company->vacancies_count > 0)
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-primary border border-orange-100 font-mono shrink-0 flex items-center gap-1.5 relative z-10">
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>{{ $company->vacancies_count }} {{ __('elan') }}</span>
            </span>
            @else
            <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-400 border border-gray-100 shrink-0 relative z-10">
                {{ __('0 elan') }}
            </span>
            @endif
        </div>

        <!-- About / Description -->
        <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed mt-1">
            {{ $company->about ?: __('Bu şirkət haqqında ətraflı məlumat tezliklə əlavə olunacaq.') }}
        </p>
    </div>

    <!-- Card Bottom Action -->
    <div class="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
        @if($company->website)
        <a href="{{ $company->website }}" target="_blank" rel="noopener noreferrer"
           class="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-[11px] transition relative z-10"
           onclick="event.stopPropagation()">
            <i class="fas fa-globe text-[10px]"></i>
            <span class="truncate max-w-[130px]">{{ preg_replace('#^https?://(www\.)?#', '', $company->website) }}</span>
        </a>
        @else
        <span class="text-gray-400 text-[11px] flex items-center gap-1">
            <i class="far fa-clock text-[10px]"></i>
            <span>{{ $company->created_at ? $company->created_at->translatedFormat('M Y') : '' }}</span>
        </span>
        @endif

        <span class="text-primary group-hover:text-primary-dark font-bold flex items-center gap-1 transition">
            <span>{{ __('Şirkətə bax') }}</span>
            <i class="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition duration-200"></i>
        </span>
    </div>

</div>
