@extends('layouts.app')

@section('title', __('Sıkça Sorulan Sorular') . ' - ' . config('app.full_name'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">

        <!-- Header -->
        <div class="text-center mb-10">
            <div class="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <i class="fas fa-question text-xl"></i>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ __('Sıkça Sorulan Sorular') }}</h1>
            <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">{{ __('İş axtarışı və vakansiya prosesləri ilə bağlı ən çox verilən suallar.') }}</p>
        </div>

        @if($faqGroups->isEmpty())
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-2xs">
            <p class="text-sm text-gray-500">{{ __('Hələ heç bir sual əlavə olunmayıb.') }}</p>
        </div>
        @else
        <!-- FAQ Accordion (Alpine.js) -->
        <div class="space-y-4">
            @foreach($faqGroups as $category => $faqs)
            <div>
                @if($faqGroups->count() > 1)
                <h2 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{{ $category }}</h2>
                @endif
                <div class="space-y-3">
                    @foreach($faqs as $faq)
                    <div class="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden" x-data="{ open: false }">
                        <button type="button"
                                @click="open = !open"
                                class="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-gray-50 transition"
                                :aria-expanded="open">
                            <span class="font-bold text-gray-900 text-sm sm:text-base">{{ $faq->question }}</span>
                            <span class="w-7 h-7 rounded-lg bg-orange-50 text-primary flex items-center justify-center shrink-0 transition-transform duration-200"
                                  :class="open ? 'rotate-45' : ''">
                                <i class="fas fa-plus text-xs"></i>
                            </span>
                        </button>
                        <div x-show="open"
                             x-collapse
                             x-cloak
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0"
                             x-transition:enter-end="opacity-100"
                             x-transition:leave="transition ease-in duration-150"
                             x-transition:leave-start="opacity-100"
                             x-transition:leave-end="opacity-0">
                            <div class="px-5 pb-5 -mt-1 text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                                {!! nl2br(e($faq->answer)) !!}
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endforeach
        </div>
        @endif

        <!-- Contact CTA -->
        <div class="mt-10 text-center bg-white rounded-2xl border border-gray-200 p-8 shadow-2xs">
            <h3 class="text-base font-bold text-gray-900 mb-1">{{ __('Cavabınızı tapa bilmədiniz?') }}</h3>
            <p class="text-xs text-gray-500 mb-5">{{ __('Bizimlə əlaqə saxlayın, sizə kömək edək.') }}</p>
            <a href="{{ route('companies.index') }}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
                <i class="fas fa-paper-plane text-xs"></i>
                <span>{{ __('Əlaqə saxla') }}</span>
            </a>
        </div>

    </div>
</div>
@endsection
