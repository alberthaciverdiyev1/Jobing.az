@extends('layouts.app')

@section('title', __('Kariyer Bloğu') . ' - ' . config('app.full_name'))

@section('content')
<script>
window.__BLOG_CONFIG__ = {
    initialCategory: @json(request('category', '')),
    initialQuery: @json(request('q', request('search', ''))),
    initialTotal: {{ (int) $blogs->total() }},
};
</script>

<div class="bg-gray-50 min-h-screen pb-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10" x-data="blogManager()">

        <!-- Header -->
        <div class="text-center mb-8">
            <div class="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-2xs">
                <i class="fas fa-blog text-xl"></i>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ __('Kariyer Bloğu') }}</h1>
            <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">{{ __('İş axtarışı, CV hazırlama və karyera ipuçları.') }}</p>

            <!-- Search bar -->
            <div class="max-w-md mx-auto mt-6 relative">
                <input type="text"
                       x-model="q"
                       @input.debounce.400ms="applyFilters()"
                       @keydown.enter.prevent="applyFilters()"
                       placeholder="{{ __('Məqalələrdə axtar...') }}"
                       class="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-hidden transition shadow-2xs">
                <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                <button type="button"
                        x-show="q"
                        x-cloak
                        @click="q = ''; applyFilters()"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>

        <!-- Category filter -->
        @if($categories->isNotEmpty())
        <div class="flex flex-wrap justify-center gap-2 mb-8">
            <button type="button"
                    @click="selectCategory('')"
                    class="px-4 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer"
                    :class="category === '' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'">
                {{ __('Hamısı') }}
            </button>
            @foreach($categories as $cat)
            <button type="button"
                    @click="selectCategory('{{ addslashes($cat) }}')"
                    class="px-4 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer"
                    :class="isCategoryActive('{{ addslashes($cat) }}') ? 'bg-primary text-white border-primary shadow-xs' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'">
                {{ $cat }}
            </button>
            @endforeach
        </div>
        @endif

        <!-- Blog Container -->
        <div id="blog-container" class="relative min-h-[300px]" :class="isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-150' : ''">
            @include('pages.blog.partials.blog-list', ['blogs' => $blogs])
        </div>

    </div>
</div>
@endsection
