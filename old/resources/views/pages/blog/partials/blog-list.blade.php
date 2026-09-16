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
                <span>{{ $blog->reading_time }} {{ __('min read') }}</span>
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
    <h3 class="text-base font-bold text-gray-900 mb-1">{{ __('No blog posts found') }}</h3>
    <p class="text-xs text-gray-500 max-w-sm mx-auto mb-5">{{ __('Try again by changing your search criteria or resetting the filter.') }}</p>
    <button type="button"
            @click="resetAllFilters()"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition shadow-xs cursor-pointer">
        <i class="fas fa-sync-alt text-xs"></i>
        <span>{{ __('Reset all filters') }}</span>
    </button>
</div>
@endif
