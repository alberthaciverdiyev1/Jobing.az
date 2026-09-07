@extends('layouts.app')

@section('title', __('Post a Job-Seeking Ad') . ' - ' . config('app.full_name'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200 py-10">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {{ __('Post a Job-Seeking Ad') }}
            </h1>
            <p class="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
                {{ __('Introduce yourself to thousands of companies and discover career opportunities.') }}
            </p>
        </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        @if ($errors->any())
        <div class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            <div class="font-bold mb-1">{{ __('An error occurred:') }}</div>
            <ul class="list-disc pl-5 space-y-1 text-xs">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <form method="POST" action="{{ route('job-seekers.store') }}" class="space-y-6">
            @csrf

            <!-- Basic Info -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6">
                <h2 class="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                    <span class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs"><i class="fas fa-user"></i></span>
                    {{ __('Basic information') }}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Ad title') }} <span class="text-primary">*</span></label>
                        <input type="text" name="title" value="{{ old('title') }}" required maxlength="255" placeholder="{{ __('e.g. I am looking for a Senior Laravel Developer') }}"
                               class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Position / Title') }}</label>
                        <input type="text" name="position" value="{{ old('position') }}" maxlength="255" placeholder="{{ __('e.g. Backend Developer') }}"
                               class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('City') }}</label>
                        <select name="location" class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary text-sm cursor-pointer">
                            <option value="">{{ __('Select') }}</option>
                            @foreach($cities as $city)
                            <option value="{{ $city }}" @selected(old('location') === $city)>{{ $city }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Category') }}</label>
                        <select name="category_id" class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary text-sm cursor-pointer">
                            <option value="">{{ __('Select') }}</option>
                            @foreach($categories as $cat)
                            <optgroup label="{{ $cat->name }}">
                                @foreach($cat->children as $child)
                                <option value="{{ $child->id }}" @selected(old('category_id') == $child->id)>{{ $child->name }}</option>
                                @endforeach
                            </optgroup>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Job type') }}</label>
                        <select name="job_type_id" class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary text-sm cursor-pointer">
                            <option value="">{{ __('Select') }}</option>
                            @foreach($jobTypes as $jt)
                            <option value="{{ $jt->id }}" @selected(old('job_type_id') == $jt->id)>{{ $jt->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Workplace') }}</label>
                        <select name="workplace_type_id" class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary text-sm cursor-pointer">
                            <option value="">{{ __('Select') }}</option>
                            @foreach($workplaceTypes as $wt)
                            <option value="{{ $wt->id }}" @selected(old('workplace_type_id') == $wt->id)>{{ $wt->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Experience level') }}</label>
                        <select name="experience_level_id" class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary text-sm cursor-pointer">
                            <option value="">{{ __('Select') }}</option>
                            @foreach($experienceLevels as $el)
                            <option value="{{ $el->id }}" @selected(old('experience_level_id') == $el->id)>{{ $el->name }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>

            <!-- About -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6">
                <h2 class="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                    <span class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs"><i class="fas fa-file-alt"></i></span>
                    {{ __('Introduce yourself') }}
                </h2>
                <div class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Your experience and skills') }} <span class="text-primary">*</span></label>
                        <textarea name="description" rows="5" required placeholder="{{ __('Tell us about your experience, achievements and the opportunities you are looking for...') }}"
                                  class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition resize-y">{{ old('description') }}</textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Skills (comma separated)') }}</label>
                        <input type="text" name="skills" value="{{ old('skills') }}" placeholder="Laravel, MySQL, Docker, Redis"
                               class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition">
                    </div>
                </div>
            </div>

            <!-- Salary & Availability -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6">
                <h2 class="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                    <span class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs"><i class="fas fa-money-bill-wave"></i></span>
                    {{ __('Salary & availability') }}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Minimum salary') }}</label>
                        <input type="number" name="salary_min" value="{{ old('salary_min') }}" min="0" placeholder="1000"
                               class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Maximum salary') }}</label>
                        <input type="number" name="salary_max" value="{{ old('salary_max') }}" min="0" placeholder="3000"
                               class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Currency') }}</label>
                        <select name="currency" class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary text-sm cursor-pointer">
                            @foreach(['AZN','USD','EUR','TRY'] as $cur)
                            <option value="{{ $cur }}" @selected(old('currency', 'AZN') === $cur)>{{ $cur }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="flex items-center gap-3 pt-1">
                        <input type="hidden" name="salary_negotiable" value="0">
                        <input type="checkbox" name="salary_negotiable" value="1" id="salary_negotiable" @checked(old('salary_negotiable')) class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                        <label for="salary_negotiable" class="text-xs font-semibold text-gray-700 cursor-pointer">{{ __('Negotiable') }}</label>
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Availability') }}</label>
                        <select name="availability" class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary text-sm cursor-pointer">
                            <option value="immediate" @selected(old('availability', 'immediate') === 'immediate')>{{ __('Can start immediately') }}</option>
                            <option value="two_weeks" @selected(old('availability') === 'two_weeks')>{{ __('Within 2 weeks') }}</option>
                            <option value="one_month" @selected(old('availability') === 'one_month')>{{ __('Within 1 month') }}</option>
                            <option value="flexible" @selected(old('availability') === 'flexible')>{{ __('Flexible') }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Contact -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6">
                <h2 class="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
                    <span class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs"><i class="fas fa-address-book"></i></span>
                    {{ __('Contact details') }}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Full Name') }} <span class="text-primary">*</span></label>
                        <input type="text" name="contact_name" value="{{ old('contact_name', auth()->user()->name ?? '') }}" required maxlength="255"
                               class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Email') }}</label>
                        <input type="email" name="contact_email" value="{{ old('contact_email', auth()->user()->email ?? '') }}" maxlength="255"
                               class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Phone') }}</label>
                        <input type="text" name="contact_phone" value="{{ old('contact_phone') }}" maxlength="50" placeholder="+994 __ ___ __ __"
                               class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition">
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit" class="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md hover:shadow-lg transition duration-200 flex items-center gap-2 cursor-pointer">
                    <i class="fas fa-paper-plane text-xs"></i>
                    <span>{{ __('Post the ad') }}</span>
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
