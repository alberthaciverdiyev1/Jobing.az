<?php

namespace App\Modules\Story\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Story\Models\Story;
use App\Modules\Story\Models\StoryView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    public function view(Request $request, Story $story): JsonResponse
    {
        $story = Story::query()->active()->find($story->id);

        abort_if($story === null, 404);

        StoryView::query()->firstOrCreate(
            [
                'story_id' => $story->id,
                'user_id' => $request->user()->id,
            ],
            ['viewed_at' => now()],
        );

        return response()->json(['success' => true]);
    }

    public function sync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'max:200'],
            'ids.*' => ['integer'],
        ]);

        $storyIds = Story::query()
            ->active()
            ->whereIn('id', array_unique($validated['ids']))
            ->pluck('id');

        if ($storyIds->isEmpty()) {
            return response()->json(['success' => true, 'synced' => 0]);
        }

        $now = now();

        $rows = $storyIds->map(fn (int $storyId): array => [
            'story_id' => $storyId,
            'user_id' => $request->user()->id,
            'viewed_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        StoryView::query()->insertOrIgnore($rows);

        return response()->json(['success' => true, 'synced' => $storyIds->count()]);
    }
}
