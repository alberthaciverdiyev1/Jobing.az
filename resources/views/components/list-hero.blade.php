@props([
    'title',
    'placeholder' => null,
    'showSearch' => true,
])

@php
    $placeholder = $placeholder ?? __('Profession, role or company') . '...';
    $heroIcons = [
        ['fa-briefcase', 6, 18, 64, -12],
        ['fa-user-tie', 88, 14, 58, 10],
        ['fa-building', 15, 62, 52, 8],
        ['fa-file-lines', 78, 66, 60, -8],
        ['fa-graduation-cap', 28, 12, 40, 14],
        ['fa-laptop-code', 8, 44, 48, -6],
        ['fa-map-marker-alt', 92, 40, 44, 12],
        ['fa-magnifying-glass', 68, 10, 40, -14],
        ['fa-chart-line', 84, 82, 52, 6],
        ['fa-handshake', 4, 80, 44, -10],
        ['fa-users', 40, 78, 46, 8],
        ['fa-clock', 22, 34, 38, -18],
        ['fa-envelope', 72, 34, 40, 16],
        ['fa-star', 12, 8, 34, -20],
        ['fa-money-bill-wave', 56, 6, 38, 10],
        ['fa-comments', 60, 86, 42, -6],
        ['fa-id-card', 34, 52, 36, 12],
        ['fa-lightbulb', 94, 62, 38, -12],
        ['fa-bullseye', 48, 16, 32, 18],
        ['fa-rocket', 90, 6, 36, -16],
        ['fa-sack-dollar', 2, 58, 40, 6],
        ['fa-bell', 66, 52, 34, -10],
        ['fa-bolt', 30, 88, 34, 14],
        ['fa-globe', 96, 24, 40, -10],
        ['fa-book', 18, 46, 38, 12],
        ['fa-comment-dots', 52, 30, 32, -16],
        ['fa-percent', 44, 66, 34, 8],
        ['fa-paper-plane', 10, 28, 36, -8],
        ['fa-chart-pie', 70, 74, 40, 14],
        ['fa-trophy', 26, 84, 38, -12],
        ['fa-camera', 82, 50, 34, 10],
        ['fa-wallet', 36, 4, 36, -14],
    ];
@endphp

<section class="relative overflow-hidden bg-linear-to-br from-orange-50 to-orange-100">
    <!-- Decorative icons scattered across the hero -->
    @php $mobileIconLimit = 10; @endphp
    @foreach($heroIcons as [$icon, $x, $y, $size, $rot])
    <i class="fas {{ $icon }} hero-icon absolute text-primary/10 pointer-events-none {{ $loop->index >= $mobileIconLimit ? 'hidden lg:block' : '' }}"
       style="left: {{ $x }}%; top: {{ $y }}%; font-size: {{ $size }}px; --hero-rot: {{ $rot }}deg; animation-duration: {{ 6 + ($loop->index % 5) }}s; animation-delay: -{{ ($loop->index % 7) * 0.5 }}s;"></i>
    @endforeach

    <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 text-center">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-7">
            {{ $title }}
        </h2>

        @if($showSearch)
        <form @submit.prevent="applyFilters()" class="flex flex-col lg:flex-row gap-2.5 lg:gap-3 max-w-4xl mx-auto">
            <div class="relative flex-1">
                <i class="fas fa-search absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-base lg:text-lg"></i>
                <input type="text"
                       x-model="q"
                       @input.debounce.400ms="applyFilters()"
                       placeholder="{{ $placeholder }}"
                       class="w-full h-12 lg:h-16 pl-11 pr-11 lg:pl-14 lg:pr-14 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl lg:rounded-2xl text-base lg:text-lg focus:outline-hidden focus:border-primary transition">
                <button type="button"
                        x-show="q"
                        x-cloak
                        @click="q = ''; applyFilters()"
                        class="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base lg:text-lg cursor-pointer">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <button type="submit"
                    class="hidden lg:inline-flex h-16 bg-primary hover:bg-primary-dark text-white font-semibold px-10 rounded-2xl text-lg transition-colors items-center justify-center whitespace-nowrap cursor-pointer">
                {{ __('Search') }}
            </button>
        </form>
        @endif

        @if(!$slot->isEmpty())
            {{ $slot }}
        @endif

        @isset($chips)
        <div class="flex flex-wrap items-center justify-center gap-2 mt-6">
            {{ $chips }}
        </div>
        @endisset
    </div>
</section>
