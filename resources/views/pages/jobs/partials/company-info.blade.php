@props(['job'])

@if($job->company)
                <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
                    <h3 class="text-[11px] font-medium text-gray-400 pb-2 border-b border-gray-100">
                        {{ __('Employer Company') }}
                    </h3>

                    <div class="flex items-center gap-3.5">
                        @if($job->company && $job->company->hasPublicProfile())
                        <a href="{{ route('companies.show', $job->company->slug) }}" class="w-12 h-12 rounded-xl bg-slate-900 border border-gray-200 shadow-2xs flex items-center justify-center font-semibold text-white text-base shrink-0 overflow-hidden">
                            @if($job->company?->logo)
                            <img src="{{ asset('storage/' . $job->company->logo) }}" alt="{{ $job->company->name }}" class="w-full h-full object-cover">
                            @else
                            {{ mb_substr($job->company->name ?? 'J', 0, 1) }}
                            @endif
                        </a>
                        @else
                        <div class="w-12 h-12 rounded-xl bg-slate-900 border border-gray-200 shadow-2xs flex items-center justify-center font-semibold text-white text-base shrink-0 overflow-hidden">
                            {{ mb_substr($job->company->name ?? 'J', 0, 1) }}
                        </div>
                        @endif

                        <div class="min-w-0">
                            <h4 class="font-semibold text-gray-900 text-sm truncate flex items-center gap-1">
                                @if($job->company && $job->company->hasPublicProfile())
                                <a href="{{ route('companies.show', $job->company->slug) }}" class="hover:text-primary transition truncate">
                                    {{ $job->company->name }}
                                </a>
                                @if($job->company?->is_verified)
                                <i class="fas fa-check-circle text-sky-500 text-xs shrink-0"></i>
                                @endif
                                @else
                                <span class="truncate">{{ $job->company?->name ?? __('Employer Company') }}</span>
                                @endif
                            </h4>
                            <span class="text-xs text-gray-500 truncate block">{{ $job->company?->city_name ?: ($job->company?->location ?? __('Baku, Azerbaijan')) }}</span>
                        </div>
                    </div>

                    @if($job->company?->about)
                    <p class="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {{ $job->company->about }}
                    </p>
                    @endif

                    @if(($job->company && $job->company->hasPublicProfile()) || $job->company?->website)
                    <div class="pt-3 border-t border-gray-100 space-y-2">
                        @if($job->company && $job->company->hasPublicProfile())
                        <a href="{{ route('companies.show', $job->company->slug) }}"
                           class="w-full py-2 px-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 text-gray-700 hover:text-primary font-semibold text-xs text-center block transition">
                            {{ __('All vacancies of the company') }}
                        </a>
                        @endif

                        @if($job->company?->website)
                        <a href="{{ $job->company->website }}" target="_blank" rel="noopener noreferrer"
                           class="w-full py-1.5 text-xs text-gray-500 hover:text-primary flex items-center justify-center gap-1 transition">
                            <i class="fas fa-globe text-[12px]"></i>
                            <span>{{ preg_replace('#^https?://(www\.)?#', '', $job->company->website) }}</span>
                            <i class="fas fa-external-link-alt text-[10px]"></i>
                        </a>
                        @endif
                    </div>
                    @endif
                </div>
@endif

