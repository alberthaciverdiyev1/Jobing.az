@extends('layouts.app')

@section('title', __('Career Blog') . ' - ' . config('app.full_name'))

@section('content')
<script>
window.__BLOG_CONFIG__ = {
    initialCategory: @json(request('category', '')),
    initialQuery: @json(request('q', request('search', ''))),
    initialTotal: {{ (int) $blogs->total() }},
    filterErrorMessage: @json(__('Filters could not be loaded. Please try again.')),
};
</script>

<div class="bg-gray-50 min-h-screen pb-16" x-data="blogManager()">
    <div x-show="errorMessage" x-cloak class="container mx-auto px-4 pt-3">
        <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" x-text="errorMessage"></div>
    </div>

    <x-list-hero :title="__('Career Blog')" :placeholder="__('Search in articles...')" />

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

        @if($categories->isNotEmpty())
        <div class="flex flex-wrap justify-center gap-2 mb-8">
            <button type="button"
                    @click="selectCategory('')"
                    class="px-4 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer"
                    :class="category === '' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'">
                {{ __('All') }}
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

        <div id="blog-container" class="relative min-h-[300px]" :class="isLoading ? 'opacity-50 pointer-events-none transition-opacity duration-150' : ''">
            @include('pages.blog.partials.blog-list', ['blogs' => $blogs])
        </div>

    </div>
</div>
@endsection
