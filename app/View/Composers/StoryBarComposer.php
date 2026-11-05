<?php

namespace App\View\Composers;

use App\Modules\Story\Models\Story;
use App\Modules\Story\Models\StoryView;
use App\Modules\Story\Services\StoryMediaProcessor;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class StoryBarComposer
{
    public function compose(View $view): void
    {
        $stories = Cache::remember(
            'stories.bar.'.app()->getLocale(),
            now()->addSeconds(30),
            fn (): Collection => $this->activeStories(),
        );

        if ($stories->isEmpty()) {
            $view->with('storyRings', collect());

            return;
        }

        $viewedIds = auth()->check()
            ? StoryView::query()
                ->where('user_id', auth()->id())
                ->whereIn('story_id', $stories->pluck('id'))
                ->pluck('story_id')
                ->all()
            : [];

        $user = auth()->user();

        $rings = $stories
            ->groupBy(fn (Story $story): string => $story->company_id
                ? 'company-'.$story->company_id
                : 'user-'.$story->user_id)
            ->map(function (Collection $group) use ($viewedIds, $user): array {
                $first = $group->first();

                $storiesData = $group->map(fn (Story $story): array => [
                    'id' => $story->id,
                    'type' => $story->isVideo() ? 'video' : 'image',
                    'src' => $story->media_url,
                    'thumb' => $story->thumbnail_url,
                    'link' => $story->link_url,
                    'time' => $story->created_at?->diffForHumans(),
                    'viewed' => in_array($story->id, $viewedIds, true),
                    // Baxış sayını yalnız story sahibi (və super admin) görür.
                    'views' => $user && $this->canSeeViews($user, $story) ? (int) $story->views_count : null,
                ])->values();

                return [
                    'key' => ($first->company_id ? 'company-' : 'user-').($first->company_id ?: $first->user_id),
                    'name' => $first->owner_name,
                    'avatar' => $first->owner_avatar,
                    'thumb' => $group->last()->thumbnail_url,
                    'initial' => $first->owner_initial,
                    'viewed' => $storiesData->every(fn (array $story): bool => $story['viewed']),
                    'latest_at' => $group->max('created_at')?->getTimestamp() ?? 0,
                    'stories' => $storiesData,
                ];
            })
            ->sortByDesc('latest_at')
            ->sortBy('viewed')
            ->values();

        $view->with('storyRings', $rings);
    }

    protected function canSeeViews($user, Story $story): bool
    {
        if ($user->is_admin) {
            return true;
        }

        if ((int) $story->user_id === (int) $user->id) {
            return true;
        }

        return $story->company_id && (int) $story->company_id === (int) $user->company_id;
    }

    protected function activeStories(): Collection
    {
        $stories = Story::query()
            ->active()
            ->with([
                'user:id,name',
                'company:id,name,logo',
            ])
            ->orderBy('created_at')
            ->get();

        // Self-healing for stories uploaded before preview thumbnails existed.
        $processor = app(StoryMediaProcessor::class);
        $processed = 0;

        foreach ($stories as $story) {
            if ($story->media_processed_at === null && $processed < 25) {
                $processor->process($story);
                $processed++;
            }
        }

        return $stories;
    }
}
