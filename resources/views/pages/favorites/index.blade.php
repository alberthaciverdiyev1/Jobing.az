@extends('layouts.app')

@section('title', __('Saved Jobs') . ' - ' . config('app.full_name'))

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
                    <span>{{ __('Saved Jobs') }}</span>
                </h1>
                <p class="text-sm text-gray-500 mt-1">{{ __('You can view your saved vacancies here.') }}</p>
            </div>

            <a href="{{ route('jobs.index') }}" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-primary hover:text-primary text-gray-700 text-xs font-bold shadow-2xs transition cursor-pointer w-fit">
                <i class="fas fa-arrow-left text-[11px]"></i>
                <span>{{ __('All vacancies') }}</span>
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
            <h3 class="text-base font-bold text-gray-900 mb-1">{{ __('No saved jobs yet') }}</h3>
            <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5">{{ __('Browse vacancies, save the ones you like and easily find them again here.') }}</p>
            <a href="{{ route('jobs.index') }}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
                <i class="fas fa-search text-xs"></i>
                <span>{{ __('Browse vacancies') }}</span>
            </a>
        </div>
        @endif

    </div>
</div>
@endsection
