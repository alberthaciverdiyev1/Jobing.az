<?php

namespace App\Modules\JobAttribute\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function byCategory(Request $request): JsonResponse
    {
        $subcategories = array_filter((array) $request->input('subcategory', []));
        $categorySlug = $request->input('category');

        if (!empty($subcategories)) {
            $subCatIds = Category::whereIn('slug', $subcategories)->pluck('id');
            $skills = Skill::active()
                ->whereIn('category_id', $subCatIds)
                ->get()
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'name' => (string) $s->name,
                    'slug' => $s->slug,
                ])
                ->unique('name')
                ->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)
                ->values();

            return response()->json([
                'skills' => $skills,
                'mode' => 'subcategory',
            ]);
        }

        if (!empty($categorySlug)) {
            $parentCat = Category::with('children')->where('slug', $categorySlug)->first();
            if ($parentCat) {
                $catIds = $parentCat->children->pluck('id')->push($parentCat->id);
                $skills = Skill::active()
                    ->whereIn('category_id', $catIds)
                    ->get()
                    ->map(fn ($s) => [
                        'id' => $s->id,
                        'name' => (string) $s->name,
                        'slug' => $s->slug,
                    ])
                    ->unique('name')
                    ->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)
                    ->values();

                return response()->json([
                    'skills' => $skills,
                    'mode' => 'category',
                ]);
            }
        }

        return response()->json([
            'skills' => [],
            'mode' => 'none',
        ]);
    }
}
