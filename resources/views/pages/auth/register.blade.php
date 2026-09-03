@extends('layouts.app')

@section('title', __('Qeydiyyat') . ' - ' . config('app.full_name'))

@section('content')
<div class="bg-gray-50 min-h-screen py-12 sm:py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8" x-data="{ userType: @js(old('user_type', 'user')) }">
    <div class="w-full max-w-2xl">

        <!-- Top Title / Logo -->
        <div class="text-center mb-8">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {{ __('Hesab yaradın') }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1.5">
                {{ __('İstər iş axtaran, istərsə də işəgötürən şirkət olaraq platformamıza qoşulun.') }}
            </p>
        </div>

        @if ($errors->any())
        <div class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <div class="font-bold mb-1 flex items-center gap-1.5">
                <i class="fas fa-exclamation-circle text-rose-600"></i>
                <span>{{ __('Qeydiyyat zamanı xəta baş verdi:') }}</span>
            </div>
            <ul class="list-disc pl-5 space-y-1 mt-1 text-[11px]">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        <!-- Big Register Card -->
        <div class="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <form action="{{ route('register.attempt') }}" method="POST" class="space-y-5">
                @csrf
                <input type="hidden" name="user_type" :value="userType">

                <!-- Account Type Selector -->
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                        {{ __('Hesab Növünü Seçin') }} <span class="text-rose-500">*</span>
                    </label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button type="button" @click="userType = 'user'"
                                class="rounded-xl border p-4 text-left transition duration-150 cursor-pointer flex items-start gap-3"
                                :class="userType === 'user' ? 'border-primary bg-orange-50/70 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300 bg-gray-50/40'">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="userType === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'">
                                <i class="fas fa-user text-sm"></i>
                            </div>
                            <div>
                                <span class="block font-bold text-gray-900 text-sm leading-tight">{{ __('Şəxsi İstifadəçi') }}</span>
                                <span class="text-xs text-gray-500 block mt-1 leading-snug">{{ __('İş axtarıram & CV paylaşıram') }}</span>
                            </div>
                        </button>

                        <button type="button" @click="userType = 'company'"
                                class="rounded-xl border p-4 text-left transition duration-150 cursor-pointer flex items-start gap-3"
                                :class="userType === 'company' ? 'border-primary bg-orange-50/70 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300 bg-gray-50/40'">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="userType === 'company' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'">
                                <i class="fas fa-building text-sm"></i>
                            </div>
                            <div>
                                <span class="block font-bold text-gray-900 text-sm leading-tight">{{ __('İşəgötürən Şirkət') }}</span>
                                <span class="text-xs text-gray-500 block mt-1 leading-snug">{{ __('Vakansiya elanı yerləşdirirəm') }}</span>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Individual User Fields -->
                <div x-show="userType === 'user'" x-transition>
                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        {{ __('Adınız və Soyadınız') }} <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <i class="far fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input type="text" name="name" value="{{ old('name') }}" placeholder="Ad Soyad"
                               :required="userType === 'user'"
                               class="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                    </div>
                </div>

                <!-- Company Fields -->
                <div x-show="userType === 'company'" x-transition>
                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        {{ __('Şirkətinizin Rəsmi Adı') }} <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <i class="fas fa-building absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input type="text" name="company_name" value="{{ old('company_name') }}" placeholder="Şirkət adı"
                               :required="userType === 'company'"
                               class="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                    </div>
                    <p class="text-[11px] text-gray-400 mt-1.5 pl-1">
                        {{ __('Qeydiyyatdan dərhal sonra şirkət loqosu və profil məlumatlarını tamamlayaraq ilk vakansiyanızı yerləşdirə bilərsiniz.') }}
                    </p>
                </div>

                <!-- Email Field -->
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        {{ __('E-poçt Ünvanı') }} <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <i class="far fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input type="email" name="email" value="{{ old('email') }}" required
                               placeholder="nümunə@domain.com"
                               class="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                    </div>
                </div>

                <!-- Password Fields -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            {{ __('Şifrə') }} <span class="text-rose-500">*</span>
                        </label>
                        <div class="relative">
                            <i class="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                            <input type="password" name="password" required
                                   placeholder="••••••••"
                                   class="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            {{ __('Şifrənin Təkrarı') }} <span class="text-rose-500">*</span>
                        </label>
                        <div class="relative">
                            <i class="fas fa-check-double absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                            <input type="password" name="password_confirmation" required
                                   placeholder="••••••••"
                                   class="w-full pl-10 pr-4 py-3 bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                        </div>
                    </div>
                </div>

                <button type="submit"
                        class="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm hover:shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer mt-2">
                    <i class="fas fa-user-check text-xs"></i>
                    <span>{{ __('Qeydiyyatı Tamamla') }}</span>
                </button>
            </form>

            <!-- Switch to Login Banner -->
            <div class="pt-6 border-t border-gray-100 text-center">
                <p class="text-xs text-gray-600">
                    {{ __('Artıq hesabınız var?') }}
                </p>
                <a href="{{ route('login') }}"
                   class="inline-flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-orange-50/50 text-gray-800 hover:text-primary font-bold text-xs transition duration-150 shadow-2xs">
                    <i class="fas fa-sign-in-alt text-primary text-xs"></i>
                    <span>{{ __('Mövcud hesaba daxil ol') }}</span>
                </a>
            </div>
        </div>

    </div>
</div>
@endsection
