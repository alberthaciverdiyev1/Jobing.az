<?php

namespace App\Modules\Blog\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Blog\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BlogController extends Controller
{
    public function index(Request $request): View|\Illuminate\Http\JsonResponse
    {
        $query = Blog::published();

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($search = ($request->input('search') ?: $request->input('q'))) {
            $search = trim($search);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('category', 'ilike', "%{$search}%")
                    ->orWhere('excerpt', 'ilike', "%{$search}%")
                    ->orWhere('content', 'ilike', "%{$search}%");
            });
        }

        $blogs = $query->paginate(9)->withQueryString();

        $categories = Blog::where('is_active', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        $isAjax = ($request->ajax() || $request->header('X-Partial') || $request->wantsJson()) && !$request->acceptsHtml();

        if ($isAjax) {
            return response()->json([
                'html' => view('pages.blog.partials.blog-list', [
                    'blogs' => $blogs,
                ])->render(),
                'total' => $blogs->total(),
            ])
            ->header('Vary', 'X-Requested-With, Accept')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private');
        }

        return view('pages.blog.index', [
            'blogs' => $blogs,
            'categories' => $categories,
            'selectedCategory' => $request->input('category'),
        ]);
    }

    public function show(string $slug): View
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();

        $viewKey = 'viewed_blog_' . $blog->id;
        if (! session()->has($viewKey)) {
            $blog->increment('views_count');
            session()->put($viewKey, true);
        }

        $related = Blog::published()
            ->where('id', '!=', $blog->id)
            ->where(function ($q) use ($blog) {
                if ($blog->category) {
                    $q->where('category', $blog->category);
                }
            })
            ->take(3)
            ->get();

        return view('pages.blog.show', [
            'blog' => $blog,
            'related' => $related,
        ]);
    }
}
