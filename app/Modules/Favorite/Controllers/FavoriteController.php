<?php

namespace App\Modules\Favorite\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Favorite\Models\Favorite;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class FavoriteController extends Controller
{
    /**
     * The favorites list page.
     */
    public function index(Request $request): View
    {
        $userId = auth()->id();

        $query = Favorite::with([
            'vacancy.company',
            'vacancy.category',
            'vacancy.city',
            'vacancy.jobType',
            'vacancy.workplaceType',
            'vacancy.experienceLevel',
        ])->where('user_id', $userId);

        $favorites = $query->latest()->paginate(12)->withQueryString();
        $ids = $favorites->pluck('vacancy_id')->all();

        return view('pages.favorites.index', [
            'favorites' => $favorites,
            'ids' => $ids,
        ]);
    }

    /**
     * Toggle a vacancy in/out of favorites for authenticated users.
     */
    public function toggle(Request $request): JsonResponse
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'auth_required' => true,
                'message' => 'Seçilmişlərə əlavə etmək üçün daxil olmalısınız.',
            ], 401);
        }

        $vacancyId = (int) $request->input('vacancy_id');
        if (! $vacancyId || ! Vacancy::where('id', $vacancyId)->exists()) {
            return response()->json(['success' => false, 'message' => 'Vakansiya tapılmadı'], 404);
        }

        $existing = Favorite::where('user_id', $userId)
            ->where('vacancy_id', $vacancyId)
            ->first();

        if ($existing) {
            $existing->delete();
            $isFavorite = false;
        } else {
            Favorite::create([
                'user_id' => $userId,
                'vacancy_id' => $vacancyId,
            ]);
            $isFavorite = true;
        }

        return response()->json([
            'success' => true,
            'is_favorite' => $isFavorite,
            'count' => $this->count($request),
            'ids' => $this->getIds($request),
        ]);
    }

    /**
     * Return all favorite vacancy ids for the logged in user.
     */
    public function ids(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'count' => $this->count($request),
            'ids' => $this->getIds($request),
        ]);
    }

    /**
     * Remove all favorites for the logged in user.
     */
    public function clear(Request $request): JsonResponse
    {
        $userId = auth()->id();
        if ($userId) {
            Favorite::where('user_id', $userId)->delete();
        }

        return response()->json([
            'success' => true,
            'count' => 0,
            'ids' => [],
        ]);
    }

    /**
     * Count favorites for the logged in user.
     */
    protected function count(Request $request): int
    {
        return count($this->getIds($request));
    }

    /**
     * Get favorite vacancy ids for the logged in user.
     */
    protected function getIds(Request $request): array
    {
        $userId = auth()->id();
        if (!$userId) {
            return [];
        }

        return Favorite::where('user_id', $userId)
            ->pluck('vacancy_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }
}
