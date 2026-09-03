@extends('layouts.app')

@section('title', $blog->title . ' - ' . config('app.full_name'))
@section('meta_description', strip_tags((string) $blog->excerpt))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">

        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <a href="{{ route('home') }}" class="hover:text-primary transition">{{ __('Ana Sayfa') }}</a>
            <span>/</span>
            <a href="{{ route('blog.index') }}" class="hover:text-primary transition">{{ __('Kariyer Bloğu') }}</a>
            <span>/</span>
            <span class="text-gray-900 font-medium truncate">{{ $blog->title }}</span>
        </nav>

        <!-- Cover -->
        <div class="h-52 sm:h-64 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden mb-8 shadow-2xs">
            @if($blog->cover_image)
            <img src="{{ asset('storage/' . $blog->cover_image) }}" alt="{{ $blog->title }}" class="w-full h-full object-cover">
            @else
            <i class="fas fa-newspaper text-5xl text-white/30"></i>
            @endif
        </div>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
            @if($blog->category)
            <span class="px-2.5 py-1 bg-orange-50 text-orange-700 font-semibold rounded-full border border-orange-100">{{ $blog->category }}</span>
            @endif
            <span>{{ $blog->formatted_date }}</span>
            <span>•</span>
            <span>{{ $blog->reading_time }} {{ __('dəq oxu') }}</span>
            <span>•</span>
            <span><i class="fas fa-eye text-[10px] mr-1"></i>{{ number_format($blog->views_count) }}</span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">{{ $blog->title }}</h1>

        <!-- Content -->
        <article class="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed">
            {!! $blog->content !!}
        </article>

        <!-- Related -->
        @if($related->isNotEmpty())
        <div class="mt-12 pt-8 border-t border-gray-200">
            <h3 class="font-bold text-gray-900 text-sm mb-4">{{ __('Əlaqəli məqalələr') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                @foreach($related as $r)
                <a href="{{ route('blog.show', $r->slug) }}" class="bg-white rounded-xl border border-gray-200 p-4 hover:border-primary hover:shadow-xs transition group">
                    <span class="text-[10px] text-gray-400 block mb-1">{{ $r->formatted_date }}</span>
                    <span class="text-xs font-bold text-gray-800 group-hover:text-primary transition leading-snug">{{ $r->title }}</span>
                </a>
                @endforeach
            </div>
        </div>
        @endif

    </div>
</div>
@endsection
