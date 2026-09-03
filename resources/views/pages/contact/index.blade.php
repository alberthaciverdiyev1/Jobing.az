@extends('layouts.app')

@section('title', __('İletişim') . ' - ' . config('app.full_name'))

@section('content')
@php($siteSetting = \App\Modules\Setting\Models\SiteSetting::current())
<div class="bg-gray-50 min-h-screen pb-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <!-- Header -->
        <div class="text-center mb-10">
            <div class="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <i class="fas fa-envelope text-xl"></i>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ __('Bizimlə Əlaqə') }}</h1>
            <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">{{ __('Sualınız və ya təklifiniz var? Bizə yazın, ən qısa zamanda cavablandıraq.') }}</p>
        </div>

        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
                <!-- Form -->
                <form method="POST" action="{{ route('contact.store') }}" class="p-6 sm:p-8"
                      x-data="{ submitted: false }"
                      x-on:submit="submitted = true">
                    @csrf

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <!-- Name -->
                        <div>
                            <label for="name" class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Ad Soyad') }} <span class="text-primary">*</span></label>
                            <input type="text" id="name" name="name" value="{{ old('name') }}" required maxlength="255"
                                   class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition"
                                   placeholder="{{ __('Adınız Soyadınız') }}">
                            @error('name')<p class="text-xs text-red-500 mt-1">{{ $message }}</p>@enderror
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('E-Posta') }} <span class="text-primary">*</span></label>
                            <input type="email" id="email" name="email" value="{{ old('email') }}" required maxlength="255"
                                   class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition"
                                   placeholder="you@example.com">
                            @error('email')<p class="text-xs text-red-500 mt-1">{{ $message }}</p>@enderror
                        </div>

                        <!-- Phone -->
                        <div>
                            <label for="phone" class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Telefon') }}</label>
                            <input type="tel" id="phone" name="phone" value="{{ old('phone') }}" maxlength="50"
                                   class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition"
                                   placeholder="+994 __ ___ __ __">
                            @error('phone')<p class="text-xs text-red-500 mt-1">{{ $message }}</p>@enderror
                        </div>

                        <!-- Subject -->
                        <div>
                            <label for="subject" class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Mövzu') }}</label>
                            <select id="subject" name="subject" class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition cursor-pointer">
                                <option value="">{{ __('Seçin') }}</option>
                                <option value="general" @selected(old('subject') === 'general')>{{ __('Ümumi sual') }}</option>
                                <option value="company" @selected(old('subject') === 'company')>{{ __('Şirkət / İşverən') }}</option>
                                <option value="candidate" @selected(old('subject') === 'candidate')>{{ __('Aday / İş axtaran') }}</option>
                                <option value="bug_report" @selected(old('subject') === 'bug_report')>{{ __('Xəta bildirimi') }}</option>
                                <option value="other" @selected(old('subject') === 'other')>{{ __('Digər') }}</option>
                            </select>
                            @error('subject')<p class="text-xs text-red-500 mt-1">{{ $message }}</p>@enderror
                        </div>

                        <!-- Message -->
                        <div class="sm:col-span-2">
                            <label for="message" class="block text-xs font-bold text-gray-700 mb-1.5">{{ __('Mesajınız') }} <span class="text-primary">*</span></label>
                            <textarea id="message" name="message" rows="5" required maxlength="2000"
                                      class="w-full px-4 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary text-sm transition resize-y"
                                      placeholder="{{ __('Mesajınızı buraya yazın...') }}">{{ old('message') }}</textarea>
                            @error('message')<p class="text-xs text-red-500 mt-1">{{ $message }}</p>@enderror
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-between gap-4 flex-wrap">
                        <p class="text-[11px] text-gray-400">{{ __('Bütün məlumatlarınız məxfi saxlanılır.') }}</p>
                        <button type="submit"
                                :disabled="submitted"
                                class="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md hover:shadow-lg transition duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                            <i class="fas fa-paper-plane text-xs"></i>
                            <span x-show="!submitted">{{ __('Göndər') }}</span>
                            <span x-show="submitted"><i class="fas fa-spinner fa-spin"></i></span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Info strip -->
            <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-2xs">
                    <div class="w-10 h-10 bg-orange-50 text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <p class="text-xs text-gray-400 font-medium">{{ __('E-Posta') }}</p>
                    <p class="text-sm font-bold text-gray-800 mt-1">{{ $siteSetting->email ?: 'info@jobing.az' }}</p>
                </div>
                <div class="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-2xs">
                    <div class="w-10 h-10 bg-orange-50 text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-phone"></i>
                    </div>
                    <p class="text-xs text-gray-400 font-medium">{{ __('Telefon') }}</p>
                    <p class="text-sm font-bold text-gray-800 mt-1">{{ $siteSetting->phone ?: '+994 00 000 00 00' }}</p>
                </div>
                <div class="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-2xs">
                    <div class="w-10 h-10 bg-orange-50 text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-clock"></i>
                    </div>
                    <p class="text-xs text-gray-400 font-medium">{{ __('İş Saatları') }}</p>
                    <p class="text-sm font-bold text-gray-800 mt-1">{{ $siteSetting->working_hours ?: 'Mon – Fri · 09:00 – 18:00' }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
