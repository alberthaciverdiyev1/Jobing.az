@extends('layouts.app')

@section('title', __('Kaydedilen İlanlar') . ' - ' . config('app.full_name'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                    <span class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <i class="fas fa-heart text-lg"></i>
                    </span>
                    <span>{{ __('Kaydedilen İlanlar') }}</span>
                </h1>
                <p class="text-sm text-gray-500 mt-1">{{ __('Saxladığınız vakansiyaları burada görə bilərsiniz.') }}</p>
            </div>

            <a href="{{ route('jobs.index') }}" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-primary hover:text-primary text-gray-700 text-xs font-bold shadow-2xs transition cursor-pointer w-fit">
                <i class="fas fa-arrow-left text-[11px]"></i>
                <span>{{ __('Bütün vakansiyalar') }}</span>
            </a>
        </div>

        <!-- Favorites List -->
        @if($favorites->count() > 0)
        <div class="space-y-3" id="favorites-list">
            @foreach($favorites as $fav)
            @if($fav->vacancy)
            <x-job-card :job="$fav->vacancy" />
            @endif
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="mt-8 pagination-wrapper">
            {{ $favorites->links() }}
        </div>

        @else
        <!-- Empty State -->
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-2xs">
            <div class="w-16 h-16 bg-orange-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <i class="fas fa-heart text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-1">{{ __('Hələ kaydedilmiş ilan yoxdur') }}</h3>
            <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5">{{ __('Vakansiyalara baxıb ürəyinə yatanları saxla, daha sonra buradan asanlıqla tap.') }}</p>
            <a href="{{ route('jobs.index') }}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
                <i class="fas fa-search text-xs"></i>
                <span>{{ __('Vakansiyalara bax') }}</span>
            </a>
        </div>
        @endif

    </div>
</div>
@endsection
