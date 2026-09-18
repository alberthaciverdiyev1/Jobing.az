@extends('layouts.app')

@section('title', __('News') . ' - ' . config('app.full_name'))
@section('meta_description', __('Latest news and career updates.'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16" x-data="{ q: @js(request('q', '')), category: @js(request('category', '')) }">

    <x-list-hero :title="__('News')" :placeholder="__('Search news...')" />

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if($categories->isNotEmpty())
        <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
            <a href="{{ route('news.index') }}"
               class="px-4 py-1.5 rounded-full text-xs font-semibold border transition {{ !request('category') ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary' }}">
                {{ __('All') }}
            </a>
            @foreach($categories as $cat)
            <a href="{{ route('news.index', ['category' => $cat]) }}"
               class="px-4 py-1.5 rounded-full text-xs font-semibold border transition {{ request('category') === $cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary' }}">
                {{ $cat }}
            </a>
            @endforeach
        </div>
        @endif

        @if($news->isEmpty())
            <x-empty-state icon="fa-newspaper" :title="__('No news found')" :description="__('Try again later or change the filter.')" />
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                @foreach($news as $item)
                <article class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary transition group">
                    @if($item->image_url)
                    <a href="{{ route('news.show', $item->slug) }}" class="block aspect-[16/9] overflow-hidden bg-gray-100">
                        <img src="{{ $item->image_url }}" alt="{{ $item->title }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy">
                    </a>
                    @endif
                    <div class="p-5">
                        <div class="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            @if($item->category)<span class="text-primary font-semibold">{{ $item->category }}</span>@endif
                            <span>{{ $item->date_text }}</span>
                        </div>
                        <h2 class="text-base font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">
                            <a href="{{ route('news.show', $item->slug) }}" class="hover:text-primary transition">{{ $item->title }}</a>
                        </h2>
                        <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">{{ $item->description }}</p>
                    </div>
                </article>
                @endforeach
            </div>

            <div class="mt-8 pagination-wrapper">{{ $news->links() }}</div>
        @endif
    </div>
</div>
@endsection
