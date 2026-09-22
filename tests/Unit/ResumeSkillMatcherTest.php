<?php

namespace Tests\Unit;

use App\Modules\JobAttribute\Models\Skill;
use App\Modules\Vacancy\Support\ResumeSkillMatcher;
use PHPUnit\Framework\TestCase;

class ResumeSkillMatcherTest extends TestCase
{
    public function test_it_matches_vacancy_skills_against_resume_skill_records(): void
    {
        $resumeSkills = collect([
            new Skill(['name' => ['az' => 'PHP', 'en' => 'PHP'], 'slug' => 'php']),
            new Skill(['name' => ['az' => 'Laravel', 'en' => 'Laravel'], 'slug' => 'laravel']),
            new Skill(['name' => ['az' => 'PostgreSQL', 'en' => 'PostgreSQL'], 'slug' => 'postgresql']),
        ]);

        $result = ResumeSkillMatcher::compare($resumeSkills, ['php', 'Laravel', 'Docker', 'PostgreSQL']);

        self::assertSame([
            'percentage' => 75,
            'matched' => 3,
            'required' => 4,
        ], $result);
    }

    public function test_it_returns_null_without_resume_or_vacancy_skills(): void
    {
        self::assertNull(ResumeSkillMatcher::compare([], ['PHP']));
        self::assertNull(ResumeSkillMatcher::compare([], []));
    }
}
