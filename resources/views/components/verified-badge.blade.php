@props(['label' => null])

@if($label)
<span {{ $attributes->merge(['class' => 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100']) }}>
    <i class="fas fa-check-circle text-sky-500 text-[11px]"></i>
    <span>{{ $label }}</span>
</span>
@else
<i {{ $attributes->merge(['class' => 'fas fa-check-circle text-sky-500 text-xs']) }} title="{{ __('Təsdiqlənmiş Şirkət') }}"></i>
@endif
