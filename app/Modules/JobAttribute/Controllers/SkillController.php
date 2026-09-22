<?php

namespace App\Modules\JobAttribute\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Get skills by category or subcategory slugs.
     * - If subcategories are selected: returns skills of those subcategories.
     * - If parent category is selected: returns all skills belonging to the parent and its children.
     * - If none: returns popular active skills.
     */
    public function byCategory(Request $request): JsonResponse
    {
        $subcategories = array_filter((array) $request->input('subcategory', []));
        $categorySlug = $request->input('category');

        // 1. If subcategory (or subcategories) specified
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

        // 2. If parent category specified
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

        // 3. Fallback: if no category or subcategory specified, return empty array
        return response()->json([
            'skills' => [],
            'mode' => 'none',
        ]);
    }
}
