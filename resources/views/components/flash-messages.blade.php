@if(session('success') || session('error'))
@php $isSuccess = (bool) session('success'); @endphp
<div x-data="{ show: true }"
     x-show="show"
     x-init="setTimeout(() => show = false, 6000)"
     x-transition:enter="transition ease-out duration-300 transform"
     x-transition:enter-start="opacity-0 translate-y-[-16px]"
     x-transition:enter-end="opacity-100 translate-y-0"
     x-transition:leave="transition ease-in duration-200 transform"
     x-transition:leave-start="opacity-100 translate-y-0"
     x-transition:leave-end="opacity-0 translate-y-[-16px]"
     class="fixed top-20 right-4 sm:right-6 z-[9999] max-w-md w-[calc(100%-2rem)] sm:w-full shadow-2xl rounded-2xl overflow-hidden pointer-events-auto border {{ $isSuccess ? 'bg-emerald-900/95 border-emerald-700/60 text-white backdrop-blur-md' : 'bg-rose-900/95 border-rose-700/60 text-white backdrop-blur-md' }}">
    <div class="p-4 flex items-start gap-3">
        <div class="p-2 rounded-xl {{ $isSuccess ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300' }}">
            <i class="fas {{ $isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle' }} text-lg"></i>
        </div>
        <div class="flex-1 pt-0.5">
            <h4 class="text-sm font-bold">{{ $isSuccess ? __('Uğurlu!') : __('Xəta!') }}</h4>
            <p class="text-xs text-slate-200 mt-0.5">{{ session('success') ?? session('error') }}</p>
        </div>
        <button @click="show = false" class="text-slate-400 hover:text-white p-1 cursor-pointer">
            <i class="fas fa-times text-sm"></i>
        </button>
    </div>
</div>
@endif
