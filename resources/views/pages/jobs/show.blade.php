@extends('layouts.app')

@section('title', $job->title . ' - ' . ($job->company->name ?? config('app.full_name')))
@section('meta_description', strip_tags(Str::limit($job->description, 150)))
@section('og_image', $job->company?->logo ? asset('storage/' . $job->company->logo) : '')

@section('content')
@php
    $appType = $job->application_type ?? 'internal';
    $applyEmail = $job->application_email ?: ($job->company?->email ?? '');
    $canInternal = $appType === 'internal' || $appType === 'both';
    $canEmail = $appType === 'email' || $appType === 'both';
    $mailtoHref = $applyEmail ? 'mailto:' . $applyEmail . '?subject=' . rawurlencode('Müraciət: ' . $job->title) : '#';
@endphp

<div x-data="jobApplicationModal('{{ route('jobs.apply', $job->slug) }}')" class="bg-gray-50 min-h-screen pb-16">

    @if(!$job->is_active)
    <div class="bg-amber-50 border-b border-amber-200 py-3">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <i class="fas fa-clock text-base"></i>
                    </div>
                    <div>
                        <h4 class="text-xs sm:text-sm font-semibold text-gray-900">{{ __('Awaiting Admin Approval') }}</h4>
                        <p class="text-[12px] sm:text-xs text-gray-700">{{ __('This vacancy has been submitted and will be published on the site and in general search after admin approval.') }}</p>
                    </div>
                </div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-gray-800 font-semibold text-xs shrink-0 self-start sm:self-auto">
                    <i class="fas fa-shield-halved text-[11px]"></i>
                    {{ __('Under review') }}
                </span>
            </div>
        </div>
    </div>
    @endif

    <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-6">

                <div class="flex items-start sm:items-center gap-4 sm:gap-5">
                    @if($job->company && $job->company->hasPublicProfile())
                    <a href="{{ route('companies.show', $job->company->slug) }}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border border-gray-200 shadow-2xs flex items-center justify-center font-semibold text-white text-2xl sm:text-3xl shrink-0 overflow-hidden group/logo">
                        @if($job->company?->logo)
                        <img src="{{ asset('storage/' . $job->company->logo) }}" alt="{{ $job->company->name }}" class="w-full h-full object-cover group-hover/logo:scale-105 transition duration-200">
                        @else
                        {{ mb_substr($job->company->name ?? 'J', 0, 1) }}
                        @endif
                    </a>
                    @else
                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border border-gray-200 shadow-2xs flex items-center justify-center font-semibold text-white text-2xl sm:text-3xl shrink-0 overflow-hidden">
                        {{ mb_substr($job->company->name ?? 'J', 0, 1) }}
                    </div>
                    @endif

                    <div class="space-y-1.5">
                        <div class="flex flex-wrap items-center gap-2 text-xs">
                            @if($job->company && $job->company->hasPublicProfile())
                            <a href="{{ route('companies.show', $job->company->slug) }}" class="font-semibold text-gray-900 hover:text-primary transition flex items-center gap-1">
                                <span>{{ $job->company->name }}</span>
                                @if($job->company?->is_verified)
                                <i class="fas fa-check-circle text-sky-500 text-xs" title="{{ __('Verified Employer') }}"></i>
                                @endif
                            </a>
                            @else
                            <span class="font-semibold text-gray-900 flex items-center gap-1">
                                <span>{{ $job->company->name }}</span>
                            </span>
                            @endif

                            @if($job->is_featured)
                            <x-premium-badge />
                            @endif

                            <span class="text-gray-300">•</span>
                            <span class="text-gray-400 text-[12px]">{{ $job->created_at->diffForHumans() }}</span>
                        </div>

                        <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
                            {{ $job->title }}
                        </h2>
                    </div>
                </div>

                <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
                    <button type="button"
                            class="js-save-job px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition duration-150 flex items-center gap-2 cursor-pointer shadow-2xs"
                            data-vacancy-id="{{ $job->id }}"
                            data-save-label="{{ __('Add to favorites') }}"
                            data-saved-label="{{ __('Remove from favorites') }}"
                            aria-pressed="false"
                            title="{{ __('Add to favorites') }}">
                        <i class="far fa-heart text-sm text-rose-500"></i>
                        <span class="js-save-label">{{ __('Add to favorites') }}</span>
                    </button>

                    @if(isset($hasApplied) && $hasApplied)
                    <div class="px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                        <i class="fas fa-check-circle text-emerald-600 text-sm"></i>
                        <span>{{ __('You have already applied to this vacancy') }}</span>
                    </div>
                    @else
                    @if($canInternal)
                    <button @click="openModal()" type="button" class="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow-xs transition duration-150 flex items-center gap-2 cursor-pointer">
                        <i class="fas fa-paper-plane text-xs"></i>
                        <span>{{ __('Apply with your CV') }}</span>
                    </button>
                    @endif

                    @if($canEmail && $applyEmail)
                    <a href="{{ $mailtoHref }}" class="px-5 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition duration-150 flex items-center gap-2">
                        <i class="far fa-envelope text-xs text-gray-500"></i>
                        <span>{{ __('Apply by email') }}</span>
                    </a>
                    @endif
                    @endif
                </div>

            </div>

        </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div class="lg:col-span-2 space-y-6">

                <div class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-2xs">
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div>
                            <span class="text-[11px] font-medium text-gray-400 block">{{ __('Salary Offer') }}</span>
                            <span class="text-sm sm:text-base font-semibold text-primary font-mono mt-1 block">{{ $job->formatted_salary }}</span>
                        </div>
                        <div>
                            <span class="text-[11px] font-medium text-gray-400 block">{{ __('Experience') }}</span>
                            <span class="text-xs sm:text-sm font-semibold text-gray-900 mt-1 block">{{ $job->experience_level_name ?: '-' }}</span>
                        </div>
                        <div>
                            <span class="text-[11px] font-medium text-gray-400 block">{{ __('Employment type') }}</span>
                            <span class="text-xs sm:text-sm font-semibold text-gray-900 mt-1 block">{{ $job->job_type_name ?: '-' }}</span>
                        </div>

                        <div class="col-span-full border-t border-gray-100 -my-1"></div>

                        <div>
                            <span class="text-[11px] font-medium text-gray-400 block">{{ __('Workplace') }}</span>
                            <span class="text-xs sm:text-sm font-semibold text-gray-900 mt-1 block">{{ $job->workplace_type_name ?: '-' }}</span>
                        </div>
                        <div>
                            <span class="text-[11px] font-medium text-gray-400 block">{{ __('City / Location') }}</span>
                            <span class="text-xs sm:text-sm font-semibold text-gray-900 mt-1 block">{{ $job->city_name ?: '-' }}</span>
                        </div>
                        <div>
                            <span class="text-[11px] font-medium text-gray-400 block">{{ __('Latest Application') }}</span>
                            <span class="text-xs sm:text-sm font-semibold text-gray-900 font-mono mt-1 block">
                                {{ $job->deadline ? $job->deadline->format('d.m.Y') : __('Open-ended') }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-8">

                    <div>
                        <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
                            <span>{{ __('Job Responsibilities') }}</span>
                        </h2>
                        <div class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                            {!! sanitize_html($job->description) !!}
                        </div>
                    </div>

                    @if($job->requirements)
                    <div >
                        <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100">
                            <span>{{ __('Requirements & Experience') }}</span>
                        </h2>
                        <div class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                            {!! sanitize_html($job->requirements) !!}
                        </div>
                    </div>
                    @endif


                    @php
                        $skillsList = is_array($job->skills) ? $job->skills : (is_string($job->skills) && trim($job->skills) !== '' ? array_map('trim', explode(',', $job->skills)) : []);
                    @endphp
                    @if(!empty($skillsList) && count($skillsList) > 0)
                    <div class="space-y-3 pt-6 border-t border-gray-100">
                        <h3 class="text-[11px] font-medium text-gray-400">{{ __('Required Technologies & Skills') }}</h3>
                        <div class="flex flex-wrap gap-2">
                            @foreach($skillsList as $skill)
                            <span class="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold font-mono border border-gray-200">
                                {{ $skill }}
                            </span>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <div class="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <span>{{ __('Views:') }} <strong class="text-gray-700 font-mono">{{ $job->views_count }}</strong></span>
                        <span>{{ __('Listing ID:') }} <strong class="text-gray-700 font-mono">#{{ $job->id }}</strong></span>
                    </div>

                </div>

                @if(isset($hasApplied) && $hasApplied)
                <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <i class="fas fa-check text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold text-white">{{ __('Your Application Has Been Recorded') }}</h3>
                            <p class="text-xs text-slate-300 mt-0.5">{{ __('Your application for this vacancy has already been delivered to the employer.') }}</p>
                        </div>
                    </div>
                    <span class="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30 shrink-0 flex items-center gap-1.5">
                        <i class="fas fa-check-circle text-emerald-400"></i>
                        <span>{{ __('Applied') }}</span>
                    </span>
                </div>
                @else
                <div class="p-6 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div>
                        <h3 class="text-sm font-semibold text-white">{{ __('Do you want to apply for this position?') }}</h3>
                        <p class="text-xs text-slate-300 mt-0.5">{{ __('Submit your CV to deliver your application directly to the employer.') }}</p>
                    </div>
                    <div class="shrink-0 flex items-center gap-2">
                        @if($canInternal)
                        <button @click="openModal()" type="button" class="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow-xs transition duration-150 cursor-pointer">
                            {{ __('Apply with CV') }}
                        </button>
                        @endif
                        @if($canEmail && $applyEmail)
                        <a href="{{ $mailtoHref }}" class="px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-white font-semibold text-xs transition duration-150">
                            {{ __('By email') }}
                        </a>
                        @endif
                    </div>
                </div>
                @endif

                <div class="lg:hidden">
                    @include('pages.jobs.partials.company-info', ['job' => $job])
                </div>

                @if($relatedJobs->count() > 0)
                <div class="space-y-4 pt-6 border-t border-gray-200">
                    <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <span>{{ __('Similar Vacancies') }}</span>
                    </h3>

                    <div class="space-y-3">
                        @foreach($relatedJobs as $rel)
                        <x-job-card :job="$rel" />
                        @endforeach
                    </div>
                </div>
                @endif

            </div>

            <div class="space-y-6">

                <div class="hidden lg:block">
                    @include('pages.jobs.partials.company-info', ['job' => $job])
                </div>
                <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-3">
                    <div>
                        <h4 class="font-medium text-gray-900 text-xs">{{ __('Promote & Stand Out') }}</h4>
                        <p class="text-[12px] text-gray-500 mt-0.5">{{ __('Promote your vacancy to reach more candidates.') }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5 pt-1">
                        <button type="button" @click="bumpModalOpen = true"
                                class="w-full py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-primary font-semibold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                            <i class="fas fa-rocket text-[12px]"></i>
                            <span>{{ __('Boost') }}</span>
                        </button>
                        <button type="button" @click="premiumModalOpen = true"
                                class="w-full py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                            <i class="fas fa-crown text-[12px]"></i>
                            <span>{{ __('Make Premium') }}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <x-promotion-modals type="vacancy" :title="$job->title" :id="$job->id" />

    <div x-show="isOpen" x-cloak
         class="fixed inset-0 z-50 overflow-y-auto"
         aria-labelledby="modal-title" role="dialog" aria-modal="true">

        <div x-show="isOpen"
             x-transition:enter="ease-out duration-200"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="ease-in duration-150"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0"
             class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div x-show="isOpen"
                 x-transition:enter="ease-out duration-200"
                 x-transition:enter-start="opacity-0 translate-y-2 sm:scale-95"
                 x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
                 x-transition:leave="ease-in duration-150"
                 x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
                 x-transition:leave-end="opacity-0 translate-y-2 sm:scale-95"
                 @click.outside="closeModal()"
                 class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200">

                <div class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <div class="text-[11px] font-medium text-primary">{{ __('Job Application') }}</div>
                        <h3 class="text-sm font-semibold text-gray-900 truncate max-w-xs">{{ $job->title }}</h3>
                    </div>
                    <button @click="closeModal()" type="button" class="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>

                <form @submit.prevent="submitApplication" class="p-6 space-y-4">
                    @csrf

                    @if(isset($userResumes) && $userResumes->count() > 0)
                    <div class="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/60 space-y-2">
                        <label class="block text-xs font-semibold text-gray-900 flex items-center justify-between">
                            <span>{{ __('Apply with a System-Created CV') }}</span>
                            <span class="text-[11px] text-primary font-semibold">★ {{ __('Recommended') }}</span>
                        </label>
                        <select x-model="formData.resume_id"
                                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden bg-white font-medium text-gray-800">
                            @foreach($userResumes as $res)
                            <option value="{{ $res->id }}">
                                {{ $res->title ?: ($res->first_name . ' ' . $res->last_name . ' CV') }} {{ $res->is_default ? ' (' . __('Primary CV') . ')' : '' }}
                            </option>
                            @endforeach
                            <option value="">-- {{ __('Upload a new CV as a file') }} --</option>
                        </select>
                        <p class="text-[12px] text-gray-500" x-show="formData.resume_id">
                            <i class="fas fa-info-circle text-primary mr-0.5"></i>
                            {{ __("Your selected CV profile will be sent directly to the employer's review panel.") }}
                        </p>
                    </div>
                    @else
                    <div class="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                        <span class="text-gray-600">{{ __("Don't have a CV created in the system yet?") }}</span>
                        <a href="{{ route('filament.user.resources.my-resumes.create') }}" target="_blank" class="text-primary hover:underline font-semibold">
                            + {{ __('Create CV') }}
                        </a>
                    </div>
                    @endif

                    <div x-show="!formData.resume_id" class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">{{ __('Your Full Name') }} *</label>
                            <input type="text" x-model="formData.applicant_name" :required="!formData.resume_id"
                                   class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden">
                        </div>

                        <div class="grid grid-cols-1 {{ $job->hasApplicationField('phone') ? 'sm:grid-cols-2' : '' }} gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 mb-1">{{ __('Email Address') }} *</label>
                                <input type="email" x-model="formData.applicant_email" :required="!formData.resume_id"
                                       class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden">
                            </div>
                            @if($job->hasApplicationField('phone'))
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 mb-1">{{ __('Phone Number') }}</label>
                                <input type="tel" x-model="formData.applicant_phone"
                                       class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden">
                            </div>
                            @endif
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">
                                <span>{{ __('CV / Resume File (PDF, DOC)') }}</span> *
                            </label>
                            <div class="relative border-2 border-dashed border-gray-200 hover:border-primary rounded-xl p-4 text-center cursor-pointer transition bg-gray-50/50">
                                <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" :required="!formData.resume_id"
                                       class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                                <div class="space-y-1">
                                    <i class="fas fa-cloud-arrow-up text-xl text-primary"></i>
                                    <div class="text-xs text-gray-600" x-text="fileName ? fileName : '{{ __('Select a file or drag it here') }}'"></div>
                                    <div class="text-[11px] text-gray-400 font-mono">{{ __('PDF, DOC, DOCX (Max 10MB)') }}</div>
                                </div>
                            </div>
                        </div>

                        @if($job->hasApplicationField('linkedin') || $job->hasApplicationField('portfolio'))
                        <div class="grid grid-cols-1 {{ ($job->hasApplicationField('linkedin') && $job->hasApplicationField('portfolio')) ? 'sm:grid-cols-2' : '' }} gap-3">
                            @if($job->hasApplicationField('linkedin'))
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 mb-1">{{ __('LinkedIn URL') }}</label>
                                <input type="url" x-model="formData.linkedin_url" placeholder="https://linkedin.com/in/..."
                                       class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden">
                            </div>
                            @endif
                            @if($job->hasApplicationField('portfolio'))
                            <div>
                                <label class="block text-xs font-semibold text-gray-700 mb-1">{{ __('Portfolio / GitHub') }}</label>
                                <input type="url" x-model="formData.portfolio_url" placeholder="https://github.com/..."
                                       class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden">
                            </div>
                            @endif
                        </div>
                        @endif
                    </div>

                    @if($job->hasApplicationField('cover_letter'))
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">{{ __('Cover Letter / Notes') }}</label>
                        <textarea x-model="formData.cover_letter" rows="3" placeholder="{{ __('Tell us briefly about yourself...') }}"
                                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden"></textarea>
                    </div>
                    @endif

                    <div x-show="formMessage" x-cloak class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                        <i class="fas fa-check-circle mr-1"></i><span x-text="formMessage"></span>
                    </div>
                    <div x-show="formError" x-cloak class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                        <i class="fas fa-exclamation-circle mr-1"></i><span x-text="formError"></span>
                    </div>

                    <div class="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                        <button @click="closeModal()" type="button" class="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition cursor-pointer">
                            {{ __('Cancel') }}
                        </button>
                        <button type="submit" :disabled="isLoading" class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-xs flex items-center gap-2 disabled:opacity-50 transition cursor-pointer">
                            <span x-show="!isLoading">{{ __('Submit Application') }}</span>
                            <span x-show="isLoading" x-cloak>{{ __('Sending...') }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
function jobApplicationModal(actionUrl) {
    return {
        isOpen: false,
        bumpModalOpen: false,
        premiumModalOpen: false,
        isLoading: false,
        formMessage: '',
        formError: '',
        actionUrl: actionUrl,
        fileName: '',
        file: null,
        formData: {
            resume_id: '{{ isset($userResumes) && $userResumes->first() ? $userResumes->first()->id : "" }}',
            applicant_name: '{{ auth()->check() ? auth()->user()->name : "" }}',
            applicant_email: '{{ auth()->check() ? auth()->user()->email : "" }}',
            applicant_phone: '',
            linkedin_url: '',
            portfolio_url: '',
            cover_letter: '',
        },
        openModal() {
            this.formMessage = '';
            this.formError = '';
            this.isOpen = true;
        },
        closeModal() {
            this.isOpen = false;
        },
        handleFileUpload(event) {
            const files = event.target.files;
            if (files.length > 0) {
                this.file = files[0];
                this.fileName = files[0].name;
            }
        },
        async submitApplication() {
            this.isLoading = true;
            const data = new FormData();
            if (this.formData.resume_id) {
                data.append('resume_id', this.formData.resume_id);
            }
            data.append('applicant_name', this.formData.applicant_name);
            data.append('applicant_email', this.formData.applicant_email);
            data.append('applicant_phone', this.formData.applicant_phone || '');
            data.append('linkedin_url', this.formData.linkedin_url || '');
            data.append('portfolio_url', this.formData.portfolio_url || '');
            data.append('cover_letter', this.formData.cover_letter || '');
            if (this.file) {
                data.append('resume', this.file);
            }

            try {
                const response = await fetch(this.actionUrl, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json',
                    },
                    body: data
                });

                let resData = {};
                try {
                    resData = await response.json();
                } catch (e) { }

                if (response.ok) {
                    this.formError = '';
                    this.formMessage = resData.message || 'Müraciətiniz uğurla göndərildi!';
                    setTimeout(() => this.closeModal(), 1500);
                } else {
                    this.formMessage = '';
                    this.formError = resData.message || 'Xəta baş verdi. Zəhmət olmasa xanaları yoxlayın.';
                }
            } catch (err) {
                this.formError = 'Sistem xətası baş verdi.';
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>
@endpush

@push('structured_data')
@php
    $salaryValue = array_filter([
        '@type' => 'QuantitativeValue',
        'minValue' => $job->salary_min,
        'maxValue' => $job->salary_max,
        'unitText' => 'MONTH',
    ], fn ($v) => $v !== null);

    $jobSchema = array_filter([
        '@context' => 'https://schema.org',
        '@type' => 'JobPosting',
        'title' => $job->title,
        'description' => sanitize_html($job->description),
        'datePosted' => optional($job->created_at)->toIso8601String(),
        'validThrough' => optional($job->deadline)->toIso8601String(),
        'employmentType' => $job->job_type_name ?: null,
        'hiringOrganization' => array_filter([
            '@type' => 'Organization',
            'name' => $job->company?->name,
            'sameAs' => $job->company?->website,
            'logo' => $job->company?->logo ? asset('storage/' . $job->company->logo) : null,
        ]),
        'jobLocation' => [
            '@type' => 'Place',
            'address' => array_filter([
                '@type' => 'PostalAddress',
                'addressLocality' => $job->city_name ?: $job->company?->location,
                'addressCountry' => 'AZ',
            ]),
        ],
        'baseSalary' => ($job->salary_min || $job->salary_max) ? [
            '@type' => 'MonetaryAmount',
            'currency' => 'AZN',
            'value' => $salaryValue,
        ] : null,
        'identifier' => [
            '@type' => 'PropertyValue',
            'name' => config('app.full_name'),
            'value' => (string) $job->id,
        ],
        'url' => route('jobs.show', $job->slug),
    ], fn ($v) => $v !== null && $v !== '' && $v !== []);
@endphp
<script type="application/ld+json">{!! json_encode($jobSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}</script>
@endpush
