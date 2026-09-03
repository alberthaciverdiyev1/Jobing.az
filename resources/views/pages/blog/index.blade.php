@extends('layouts.app')

@section('title', __('Kariyer Bloğu') . ' - ' . config('app.full_name'))

@section('content')
<div class="bg-gray-50 min-h-screen pb-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <!-- Header -->
        <div class="text-center mb-10">
            <div class="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <i class="fas fa-blog text-xl"></i>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ __('Kariyer Bloğu') }}</h1>
            <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">{{ __('İş axtarışı, CV hazırlama və karyera ipuçları.') }}</p>
        </div>

        <!-- Category filter -->
        @if($categories->isNotEmpty())
        <div class="flex flex-wrap justify-center gap-2 mb-8">
            <a href="{{ route('blog.index') }}" class="px-4 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer {{ !$selectedCategory ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary' }}">
                {{ __('Hamısı') }}
            </a>
            @foreach($categories as $cat)
            <a href="{{ route('blog.index', ['category' => $cat]) }}" class="px-4 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer {{ $selectedCategory === $cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary' }}">
                {{ $cat }}
            </a>
            @endforeach
        </div>
        @endif

        @if($blogs->count() > 0)
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($blogs as $blog)
            <a href="{{ route('blog.show', $blog->slug) }}" class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-primary hover:shadow-md transition group">
                <div class="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-4xl font-bold relative overflow-hidden">
                    @if($blog->cover_image)
                    <img src="{{ asset('storage/' . $blog->cover_image) }}" alt="{{ $blog->title }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                    @else
                    <i class="fas fa-newspaper text-3xl text-white/40"></i>
                    @endif
                    @if($blog->category)
                    <span class="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur text-[10px] font-bold text-gray-700 rounded-full">{{ $blog->category }}</span>
                    @endif
                </div>
                <div class="p-5">
                    <div class="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                        <span>{{ $blog->formatted_date }}</span>
                        <span>•</span>
                        <span>{{ $blog->reading_time }} {{ __('dəq oxu') }}</span>
                    </div>
                    <h3 class="font-bold text-gray-900 text-sm leading-snug group-hover:text-primary transition line-clamp-2">{{ $blog->title }}</h3>
                    @if($blog->excerpt)
                    <p class="text-xs text-gray-500 mt-2 line-clamp-2">{{ $blog->excerpt }}</p>
                    @endif
                </div>
            </a>
            @endforeach
        </div>

        <div class="mt-8 pagination-wrapper">{{ $blogs->links() }}</div>
        @else
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-2xs">
            <div class="w-16 h-16 bg-orange-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <i class="fas fa-newspaper text-xl"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-1">{{ __('Bloq yazısı tapılmadı') }}</h3>
            <p class="text-xs text-gray-500 max-w-sm mx-auto">{{ __('Tezliklə yeni məqalələr əlavə ediləcək.') }}</p>
        </div>
        @endif

    </div>
</div>
@endsection
