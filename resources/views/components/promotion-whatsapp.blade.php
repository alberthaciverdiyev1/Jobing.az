@props([
    'mode' => 'bump',          // 'bump' | 'premium'
    'itemLabel' => 'Elan',
    'title' => '',
    'id' => null,
])

@php
    $whatsapp = \App\Modules\Setting\Models\SiteSetting::current()->whatsapp ?? config('site.whatsapp_fallback');
    $cleanWa = preg_replace('/[^0-9]/', '', $whatsapp);

    $isPremium = $mode === 'premium';
    $accent = $isPremium ? '#b45309' : '#c2410c';      // koyu amber / turuncu
    $accentSoft = $isPremium ? '#fffbeb' : '#fff7ed';  // açık zemin
    $verb = $isPremium ? 'PREMIUM ETMƏK' : 'İRƏLİ ÇƏKMƏK';

    $prices = config('site.promotions.' . $mode . '.prices', [1 => 5, 3 => 12, 7 => 25]);
    $priceLabels = array_map(fn ($p) => $p . ' ₼', $prices);

    $tags = $isPremium
        ? [1 => 'Sınaq', 3 => 'Tövsiyə', 7 => 'VIP']
        : [1 => 'Standart', 3 => 'Qənaət', 7 => 'Maksimum'];

    $heading = $isPremium ? __('Premium Status Qazan') : __('Elanı İrəli Çək');
    $subtitle = $isPremium
        ? __('Maksimum diqqət və fərqlənmə nişanı')
        : __('Axtarış nəticələrində ən yuxarı mövqeyə qalxın');

    $safeTitle = addslashes($title);
    $siteName = config('app.full_name', 'Jobing.az');
@endphp

<div x-data="{ selected: '3', prices: @js($priceLabels) }">
    <!-- Başlık -->
    <div style="display:flex;align-items:center;gap:12px;padding:2px 2px 14px;">
        <div style="flex:0 0 auto;width:42px;height:42px;border-radius:12px;background:{{ $accent }};color:#fff;font-weight:800;font-size:17px;display:flex;align-items:center;justify-content:center;">
            {{ $isPremium ? '★' : '↥' }}
        </div>
        <div style="min-width:0;">
            <div style="font-size:16px;font-weight:800;color:#111827;line-height:1.2;">{{ $heading }}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px;">{{ $subtitle }}</div>
        </div>
    </div>

    <!-- Hedef ilan -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:11px 14px;margin-bottom:16px;">
        <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;">{{ $itemLabel }}</div>
        <div style="font-size:13px;font-weight:700;color:#111827;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ $title }}</div>
    </div>

    <!-- Paket seçimi -->
    <div style="margin-bottom:16px;">
        <div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">{{ __('Paketi seçin') }}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
            @foreach([1, 3, 7] as $day)
            <button type="button"
                    @click="selected = '{{ $day }}'"
                    :style="selected === '{{ $day }}' ? { borderColor: '{{ $accent }}', background: '{{ $accentSoft }}', boxShadow: '0 0 0 1px {{ $accent }} inset' } : { borderColor: '#e5e7eb', background: '#ffffff' }"
                    style="position:relative;border:1px solid #e5e7eb;border-radius:12px;padding:15px 6px 11px;text-align:center;cursor:pointer;outline:none;transition:all .15s ease;">
                @if($day === 3)
                <div style="position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:{{ $accent }};color:#fff;font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;padding:3px 9px;border-radius:999px;white-space:nowrap;">{{ __('Populyar') }}</div>
                @endif
                <div style="font-size:13px;font-weight:700;color:#111827;">{{ $day }} {{ __('dəfə') }}</div>
                <div style="font-size:18px;font-weight:900;color:{{ $accent }};margin-top:3px;">{{ $priceLabels[$day] }}</div>
                <div style="font-size:10px;color:#6b7280;margin-top:3px;font-weight:600;">{{ $tags[$day] }}</div>
            </button>
            @endforeach
        </div>
    </div>

    <!-- WhatsApp CTA -->
    <a :href="'https://wa.me/{{ $cleanWa }}?text=' + encodeURIComponent('Salam, {{ $siteName }} saytındakı #{{ $id }} nömrəli {{ $itemLabel }}nı (\'{{ $safeTitle }}\') ' + selected + ' DƏFƏ {{ $verb }} istəyirəm (' + prices[selected] + ').')"
       target="_blank" rel="noopener"
       style="display:flex;align-items:center;justify-content:center;gap:9px;width:100%;background:#25D366;color:#fff;font-size:13px;font-weight:700;padding:12px 16px;border-radius:12px;text-decoration:none;box-sizing:border-box;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#fff;color:#25D366;font-weight:900;font-size:12px;">W</span>
        <span>{{ __('WhatsApp ilə Sifariş Et') }} (<span x-text="prices[selected]"></span>)</span>
    </a>

    <p style="margin:12px 0 0;text-align:center;font-size:11px;color:#9ca3af;line-height:1.4;">
        {{ __('Sifarişiniz təsdiqləndikdən sonra elan premium/irəli çəkilmiş olaraq aktivləşdirilir.') }}
    </p>
</div>
