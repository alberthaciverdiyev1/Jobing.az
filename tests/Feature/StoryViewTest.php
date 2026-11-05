<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Company\Models\Company;
use App\Modules\Story\Models\Story;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoryViewTest extends TestCase
{
    use RefreshDatabase;

    private function makeStory(array $attributes = []): Story
    {
        return Story::create(array_merge([
            'media_path' => 'stories/test.jpg',
            'media_type' => 'image',
            'is_active' => true,
        ], $attributes));
    }

    public function test_admin_and_company_story_pages_render(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $company = Company::create(['name' => 'Story Company']);
        $companyUser = User::factory()->create([
            'user_type' => 'company',
            'company_id' => $company->id,
        ]);

        $this->actingAs($admin)->get('/admin/stories')->assertOk();
        $this->actingAs($admin)->get('/admin/stories/create')->assertOk();

        $this->actingAs($companyUser)->get('/company/company-stories')->assertOk();
        $this->actingAs($companyUser)->get('/company/company-stories/create')->assertOk();

        $story = $this->makeStory([
            'user_id' => $companyUser->id,
            'company_id' => $company->id,
        ]);

        $this->actingAs($admin)->get('/admin/stories')->assertOk()->assertSee('Story Company');
        $this->actingAs($admin)->get("/admin/stories/{$story->id}/edit")->assertOk();

        $this->actingAs($companyUser)->get('/company/company-stories')->assertOk()->assertSee('Story Company');
        $this->actingAs($companyUser)->get("/company/company-stories/{$story->id}/edit")->assertOk();
    }

    public function test_story_bar_renders_active_stories_on_public_pages(): void
    {
        $user = User::factory()->create(['name' => 'Story Owner']);
        $this->makeStory(['user_id' => $user->id]);

        $this->get('/')
            ->assertOk()
            ->assertSee('storyViewer', false)
            ->assertSee('data-stories="[{&quot;key&quot;', false)
            ->assertDontSee('data-stories="JSON.parse', false)
            ->assertSee('Story Owner');
    }

    public function test_every_logged_in_view_is_counted_but_the_viewer_is_unique(): void
    {
        $user = User::factory()->create();
        $story = $this->makeStory();

        $this->actingAs($user)->postJson(route('stories.view', $story))->assertOk();
        $this->actingAs($user)->postJson(route('stories.view', $story))->assertOk();

        $this->assertSame(2, $story->refresh()->views_count);
        $this->assertDatabaseCount('story_views', 1);
    }

    public function test_guest_view_is_counted_without_a_viewer_row(): void
    {
        $story = $this->makeStory();

        $this->postJson(route('stories.view', $story))
            ->assertOk()
            ->assertJson(['success' => true, 'views_count' => 1]);

        $this->postJson(route('stories.view', $story))->assertOk();

        $this->assertSame(2, $story->refresh()->views_count);
        $this->assertDatabaseCount('story_views', 0);
    }

    public function test_sync_links_guest_views_to_the_account_without_counting_again(): void
    {
        $user = User::factory()->create();
        $first = $this->makeStory(['media_path' => 'stories/a.jpg']);
        $second = $this->makeStory(['media_path' => 'stories/b.jpg']);

        $this->actingAs($user)
            ->postJson(route('stories.sync'), [
                'ids' => [$first->id, $first->id, $second->id],
            ])
            ->assertOk()
            ->assertJson(['success' => true, 'synced' => 2]);

        $this->assertSame(0, $first->refresh()->views_count);
        $this->assertSame(0, $second->refresh()->views_count);
        $this->assertDatabaseCount('story_views', 2);
    }

    public function test_expired_or_inactive_story_cannot_be_viewed(): void
    {
        $user = User::factory()->create();
        $expired = $this->makeStory(['expires_at' => now()->subMinute()]);
        $inactive = $this->makeStory(['media_path' => 'stories/b.jpg', 'is_active' => false]);

        $this->actingAs($user)->postJson(route('stories.view', $expired))->assertNotFound();
        $this->actingAs($user)->postJson(route('stories.view', $inactive))->assertNotFound();

        $this->assertDatabaseCount('story_views', 0);
    }
}
