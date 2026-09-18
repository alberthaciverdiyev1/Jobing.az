<?php

namespace App\Modules\News\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\News\Models\News;
use Illuminate\Http\Request;
use Illuminate\View\View;

class NewsController extends Controller
{
    public function index(Request $request): View
    {
        $query = News::published()->with([]);

        if ($q = trim((string) $request->query('q'))) {
            $query->where('title->az', 'ilike', "%{$q}%");
        }
        if ($cat = $request->query('category')) {
            $query->where('category', $cat);
        }

        $news = $query->paginate(12)->withQueryString();

        $categories = News::query()->where('is_active', true)
            ->whereNotNull('category')->where('category', '!=', '')
            ->distinct()->orderBy('category')->pluck('category');

        return view('pages.news.index', compact('news', 'categories'));
    }

    public function show(string $slug): View
    {
        $item = News::published()->where('slug', $slug)->firstOrFail();

        if (! is_bot_request()) {
            $item->increment('views');
        }

        $related = News::published()->where('id', '!=', $item->id)
            ->when($item->category, fn ($q) => $q->where('category', $item->category))
            ->take(4)->get();

        return view('pages.news.show', compact('item', 'related'));
    }
}
