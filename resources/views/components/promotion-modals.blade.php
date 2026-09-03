{{-- Promotion Modals Component for Vacancy & JobSeeker Details (3 Options: 1 dəfə, 3 dəfə, 7 dəfə) --}}
@props([
    'type' => 'vacancy', // 'vacancy' or 'job_seeker'
    'title' => '',
    'id' => null,
])

@php
    $whatsapp = \App\Modules\Setting\Models\SiteSetting::current()->whatsapp ?? config('site.whatsapp_fallback');
    $cleanWa = preg_replace('/[^0-9]/', '', $whatsapp);
    $itemTypeLabel = $type === 'vacancy' ? __('Vakansiya') : __('İş Axtarış Elanı');
    $safeTitle = addslashes($title);

    // Promosyon fiyatları config'ten gelir.
    $bumpPrices = config('site.promotions.bump.prices');      // [1 => 5, 3 => 12, 7 => 25]
    $premiumPrices = config('site.promotions.premium.prices'); // [1 => 7, 3 => 18, 7 => 35]
    $bumpPriceLabels = array_map(fn ($p) => $p . ' ₼', $bumpPrices);
    $premiumPriceLabels = array_map(fn ($p) => $p . ' ₼', $premiumPrices);
@endphp

<!-- 1. İRƏLİ ÇƏK MODAL (BUMP) -->
<div x-show="bumpModalOpen" x-cloak
     x-data="{ selectedBump: '1', bumpPrices: @js($bumpPriceLabels) }"
     class="fixed inset-0 z-50 overflow-y-auto"
     aria-labelledby="bump-modal-title" role="dialog" aria-modal="true">

    <!-- Backdrop -->
    <div x-show="bumpModalOpen"
         x-transition:enter="ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"></div>

    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div x-show="bumpModalOpen"
             x-transition:enter="ease-out duration-200"
             x-transition:enter-start="opacity-0 translate-y-2 sm:scale-95"
             x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave="ease-in duration-150"
             x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave-end="opacity-0 translate-y-2 sm:scale-95"
             @click.outside="bumpModalOpen = false"
             class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-200">

            <!-- Header (Solid Colors - No Gradients) -->
            <div class="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-base shrink-0 border border-orange-100">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div>
                        <h3 class="text-sm font-extrabold text-gray-900" id="bump-modal-title">{{ __('Elanı İrəli Çək') }}</h3>
                        <p class="text-[11px] text-gray-500">{{ __('Axtarış nəticələrində ən yuxarı mövqeyə qalxın') }}</p>
                    </div>
                </div>
                <button @click="bumpModalOpen = false" type="button" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-5">
                <!-- Target Item Card -->
                <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{{ $itemTypeLabel }}:</span>
                    <p class="text-xs font-bold text-gray-800 truncate mt-0.5">{{ $title }}</p>
                </div>

                <!-- Advantages -->
                <div class="space-y-2 text-xs text-gray-600">
                    <div class="flex items-start gap-2.5">
                        <i class="fas fa-check text-emerald-500 mt-0.5 shrink-0"></i>
                        <span>{{ __('Elanınız axtarışda və ana səhifədə dərhal ən birinci sıraya yüksəlir.') }}</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <i class="fas fa-check text-emerald-500 mt-0.5 shrink-0"></i>
                        <span>{{ __('Tarix yenilənərək elan ən yeni kimi təqdim olunur.') }}</span>
                    </div>
                </div>

                <!-- 3 Options Selection: 1 dəfə, 3 dəfə, 7 dəfə -->
                <div class="space-y-1.5">
                    <label class="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">{{ __('Paketi seçin:') }}</label>
                    <div class="grid grid-cols-3 gap-2.5">
                        <!-- Option 1: 1 dəfə -->
                        <button type="button" @click="selectedBump = '1'"
                                class="p-3 rounded-xl border text-center transition cursor-pointer"
                                :class="selectedBump === '1' ? 'border-primary bg-orange-50 ring-1 ring-primary shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'">
                            <span class="text-xs font-bold text-gray-800 block">{{ __('1 dəfə') }}</span>
                            <span class="text-base sm:text-lg font-black text-primary font-mono block mt-1">{{ $bumpPrices[1] }} ₼</span>
                            <span class="text-[10px] text-gray-400 block mt-0.5">{{ __('Standart') }}</span>
                        </button>

                        <!-- Option 2: 3 dəfə -->
                        <button type="button" @click="selectedBump = '3'"
                                class="p-3 rounded-xl border text-center transition cursor-pointer relative"
                                :class="selectedBump === '3' ? 'border-primary bg-orange-50 ring-1 ring-primary shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'">
                            <span class="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-primary text-[8px] font-black text-white uppercase tracking-wider">{{ __('Populyar') }}</span>
                            <span class="text-xs font-bold text-gray-800 block">{{ __('3 dəfə') }}</span>
                            <span class="text-base sm:text-lg font-black text-primary font-mono block mt-1">{{ $bumpPrices[3] }} ₼</span>
                            <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">{{ __('Qənaət') }}</span>
                        </button>

                        <!-- Option 3: 7 dəfə -->
                        <button type="button" @click="selectedBump = '7'"
                                class="p-3 rounded-xl border text-center transition cursor-pointer"
                                :class="selectedBump === '7' ? 'border-primary bg-orange-50 ring-1 ring-primary shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'">
                            <span class="text-xs font-bold text-gray-800 block">{{ __('7 dəfə') }}</span>
                            <span class="text-base sm:text-lg font-black text-primary font-mono block mt-1">{{ $bumpPrices[7] }} ₼</span>
                            <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">{{ __('Maksimum') }}</span>
                        </button>
                    </div>
                </div>

                <!-- Action Button -->
                <div class="space-y-2 pt-1">
                    <a :href="'https://wa.me/{{ $cleanWa }}?text=' + encodeURIComponent('Salam, Jobing.az saytındakı #{{ $id }} nömrəli {{ $itemTypeLabel }}nı (\'{{ $safeTitle }}\') ' + selectedBump + ' DƏFƏ İRƏLİ ÇƏKMƏK istəyirəm (' + bumpPrices[selectedBump] + ').')"
                       target="_blank" rel="noopener"
                       class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer">
                        <i class="fab fa-whatsapp text-base"></i>
                        <span>{{ __('WhatsApp ilə Sifariş Et') }} (<span x-text="bumpPrices[selectedBump]"></span>)</span>
                    </a>
                    <button @click="bumpModalOpen = false" type="button" class="w-full py-2 text-xs text-gray-400 hover:text-gray-600 font-semibold text-center cursor-pointer">
                        {{ __('Bağla') }}
                    </button>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- 2. PREMIUM ET MODAL -->
<div x-show="premiumModalOpen" x-cloak
     x-data="{ selectedPremium: '1', premiumPrices: @js($premiumPriceLabels) }"
     class="fixed inset-0 z-50 overflow-y-auto"
     aria-labelledby="premium-modal-title" role="dialog" aria-modal="true">

    <!-- Backdrop -->
    <div x-show="premiumModalOpen"
         x-transition:enter="ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"></div>

    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div x-show="premiumModalOpen"
             x-transition:enter="ease-out duration-200"
             x-transition:enter-start="opacity-0 translate-y-2 sm:scale-95"
             x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave="ease-in duration-150"
             x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave-end="opacity-0 translate-y-2 sm:scale-95"
             @click.outside="premiumModalOpen = false"
             class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-200">

            <!-- Header (Solid Amber - No Gradients) -->
            <div class="bg-amber-500 px-6 py-5 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center text-base shrink-0">
                        <i class="fas fa-crown"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="text-sm font-extrabold text-white" id="premium-modal-title">{{ __('Premium Status Qazan') }}</h3>
                            <span class="px-1.5 py-0.5 rounded bg-amber-600 text-[9px] font-black uppercase tracking-wider text-white">VIP</span>
                        </div>
                        <p class="text-[11px] text-amber-100">{{ __('Maksimum diqqət və xüsusi fərqlənmə nişanı') }}</p>
                    </div>
                </div>
                <button @click="premiumModalOpen = false" type="button" class="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-5">
                <!-- Target Item Card -->
                <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span class="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">{{ $itemTypeLabel }}:</span>
                    <p class="text-xs font-bold text-gray-900 truncate mt-0.5">{{ $title }}</p>
                </div>

                <!-- Advantages -->
                <div class="space-y-2 text-xs text-gray-600">
                    <div class="flex items-start gap-2.5">
                        <i class="fas fa-star text-amber-500 mt-0.5 shrink-0"></i>
                        <span>{{ __('Xüsusi "PREMIUM" nişanı') }}</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <i class="fas fa-star text-amber-500 mt-0.5 shrink-0"></i>
                        <span>{{ __('Axtarış və kateqoriya səhifələrində hər zaman ən yuxarı blokda qalır.') }}</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <i class="fas fa-star text-amber-500 mt-0.5 shrink-0"></i>
                        <span>{{ __('Ana səhifədəki "Önə Çıxan Vakansiyalar" vitrininə daxil edilir.') }}</span>
                    </div>
                </div>

                <!-- 3 Options Selection: 1 dəfə, 3 dəfə, 7 dəfə -->
                <div class="space-y-1.5">
                    <label class="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">{{ __('Paketi seçin:') }}</label>
                    <div class="grid grid-cols-3 gap-2.5">
                        <!-- Option 1: 1 dəfə -->
                        <button type="button" @click="selectedPremium = '1'"
                                class="p-3 rounded-xl border text-center transition cursor-pointer"
                                :class="selectedPremium === '1' ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500 shadow-xs' : 'border-gray-200 hover:border-amber-300 bg-white'">
                            <span class="text-xs font-bold text-gray-800 block">{{ __('1 dəfə') }}</span>
                            <span class="text-base sm:text-lg font-black text-amber-600 font-mono block mt-1">{{ $premiumPrices[1] }} ₼</span>
                            <span class="text-[10px] text-gray-400 block mt-0.5">{{ __('Sınaq') }}</span>
                        </button>

                        <!-- Option 2: 3 dəfə -->
                        <button type="button" @click="selectedPremium = '3'"
                                class="p-3 rounded-xl border text-center transition cursor-pointer relative"
                                :class="selectedPremium === '3' ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500 shadow-xs' : 'border-gray-200 hover:border-amber-300 bg-white'">
                            <span class="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-amber-500 text-[8px] font-black text-white uppercase tracking-wider">{{ __('Populyar') }}</span>
                            <span class="text-xs font-bold text-gray-800 block">{{ __('3 dəfə') }}</span>
                            <span class="text-base sm:text-lg font-black text-amber-600 font-mono block mt-1">{{ $premiumPrices[3] }} ₼</span>
                            <span class="text-[10px] text-amber-800 font-bold block mt-0.5">{{ __('Tövsiyə') }}</span>
                        </button>

                        <!-- Option 3: 7 dəfə -->
                        <button type="button" @click="selectedPremium = '7'"
                                class="p-3 rounded-xl border text-center transition cursor-pointer"
                                :class="selectedPremium === '7' ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500 shadow-xs' : 'border-gray-200 hover:border-amber-300 bg-white'">
                            <span class="text-xs font-bold text-gray-800 block">{{ __('7 dəfə') }}</span>
                            <span class="text-base sm:text-lg font-black text-amber-600 font-mono block mt-1">{{ $premiumPrices[7] }} ₼</span>
                            <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">{{ __('VIP') }}</span>
                        </button>
                    </div>
                </div>

                <!-- Action Button (Solid Flat Colors) -->
                <div class="space-y-2 pt-1">
                    <a :href="'https://wa.me/{{ $cleanWa }}?text=' + encodeURIComponent('Salam, Jobing.az saytındakı #{{ $id }} nömrəli {{ $itemTypeLabel }}nı (\'{{ $safeTitle }}\') ' + selectedPremium + ' DƏFƏ PREMIUM ETMƏK istəyirəm (' + premiumPrices[selectedPremium] + ').')"
                       target="_blank" rel="noopener"
                       class="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer">
                        <i class="fab fa-whatsapp text-base"></i>
                        <span>{{ __('WhatsApp ilə Sifariş Et') }} (<span x-text="premiumPrices[selectedPremium]"></span>)</span>
                    </a>
                    <button @click="premiumModalOpen = false" type="button" class="w-full py-2 text-xs text-gray-400 hover:text-gray-600 font-semibold text-center cursor-pointer">
                        {{ __('Bağla') }}
                    </button>
                </div>
            </div>

        </div>
    </div>
</div>
