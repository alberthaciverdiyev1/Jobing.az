<?php

namespace App\Modules\Category\Services;

use App\Modules\Category\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function getParentCategoriesWithCounts(): Collection
    {
        return Category::parents()
            ->with(['children' => fn ($q) => $q->withCount(['vacancies' => fn ($jq) => $jq->active()])])
            ->withCount(['vacancies' => fn ($q) => $q->active()])
            ->get();
    }

    public function findBySlug(string $slug): ?Category
    {
        return Category::where('slug', $slug)->first();
    }
}
