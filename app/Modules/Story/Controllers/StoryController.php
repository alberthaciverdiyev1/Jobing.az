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

        // Günlük ziyarət statistikası kimi: hər baxış sayılır, unikal deyil.
        $story->increment('views_count');

        StoryView::query()->firstOrCreate(
            [
                'story_id' => $story->id,
                'user_id' => $request->user()->id,
            ],
            ['viewed_at' => now()],
        );

        return response()->json(['success' => true, 'views_count' => $story->views_count]);
    }

    public function sync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'max:200'],
            'ids.*' => ['integer'],
        ]);

        // Eyni ID bir neçə dəfə gələ bilər — hər təkrar bir baxış sayılır.
        $counts = array_count_values($validated['ids']);

        $activeIds = Story::query()
            ->active()
            ->whereIn('id', array_keys($counts))
            ->pluck('id')
            ->all();

        $synced = 0;

        foreach ($counts as $storyId => $count) {
            if (! in_array($storyId, $activeIds, true)) {
                continue;
            }

            Story::query()->whereKey($storyId)->increment('views_count', $count);

            StoryView::query()->firstOrCreate(
                [
                    'story_id' => $storyId,
                    'user_id' => $request->user()->id,
                ],
                ['viewed_at' => now()],
            );

            $synced += $count;
        }

        return response()->json(['success' => true, 'synced' => $synced]);
    }
}
