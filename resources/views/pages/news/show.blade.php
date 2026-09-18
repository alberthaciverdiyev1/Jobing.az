@extends('layouts.app')

@section('title', $item->title . ' - ' . config('app.full_name'))
@section('meta_description', $item->description ?: '')
@section('og_type', 'article')
@if($item->image_url)@section('og_image', $item->image_url)@endif

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">

        <nav class="text-xs text-gray-400 mb-6 flex items-center gap-2">
            <a href="{{ url('/') }}" class="hover:text-primary transition">{{ __('Home') }}</a>
            <span>/</span>
            <a href="{{ route('news.index') }}" class="hover:text-primary transition">{{ __('News') }}</a>
        </nav>

        @if($item->category)
        <span class="inline-block text-xs font-semibold text-primary mb-3">{{ $item->category }}</span>
        @endif

        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-3">{{ $item->title }}</h1>

        <div class="flex items-center gap-3 text-xs text-gray-400 mb-6">
            <span>{{ $item->date_text }}</span>
            @if($item->source_name)<span>• {{ $item->source_name }}</span>@endif
            <span>• {{ $item->views }} {{ __('views') }}</span>
        </div>

        @if($item->image_url)
        <img src="{{ $item->image_url }}" alt="{{ $item->title }}" class="w-full rounded-xl mb-6 border border-gray-200">
        @endif

        <div class="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed">
            {!! sanitize_html($item->content) !!}
        </div>

        @if($item->source_url)
        <p class="mt-6 text-xs text-gray-400">
            {{ __('Source:') }}
            <a href="{{ $item->source_url }}" target="_blank" rel="noopener nofollow" class="text-primary hover:underline">{{ $item->source_name ?: $item->source_url }}</a>
        </p>
        @endif

        @if($related->isNotEmpty())
        <div class="mt-12 pt-8 border-t border-gray-200">
            <h3 class="text-base font-semibold text-gray-900 mb-4">{{ __('Similar News') }}</h3>
            <div class="space-y-3">
                @foreach($related as $rel)
                <a href="{{ route('news.show', $rel->slug) }}" class="block bg-white border border-gray-200 rounded-xl p-4 hover:border-primary transition">
                    <h4 class="text-sm font-semibold text-gray-900 line-clamp-2">{{ $rel->title }}</h4>
                    <span class="text-xs text-gray-400 mt-1 block">{{ $rel->date_text }}</span>
                </a>
                @endforeach
            </div>
        </div>
        @endif
    </div>
</div>
@endsection
