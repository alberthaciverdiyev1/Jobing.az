<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_vacancy', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained('vacancies')->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained('skills')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['vacancy_id', 'skill_id']);
            $table->index('skill_id');
        });

        $lookup = [];
        foreach (DB::table('skills')->get(['id', 'name', 'slug']) as $skill) {
            $translations = is_string($skill->name) ? (json_decode($skill->name, true) ?: []) : (array) $skill->name;
            foreach ([...array_values($translations), $skill->slug] as $name) {
                if (is_string($name) && trim($name) !== '') {
                    $lookup[mb_strtolower(trim($name))] = $skill->id;
                }
            }
        }

        DB::table('vacancies')->whereNotNull('skills')->orderBy('id')->each(function (object $vacancy) use ($lookup): void {
            $items = is_string($vacancy->skills) ? (json_decode($vacancy->skills, true) ?: []) : (array) $vacancy->skills;
            $rows = [];
            foreach ($items as $item) {
                $name = is_array($item) ? ($item['name'] ?? $item['label'] ?? $item['value'] ?? null) : $item;
                $skillId = is_string($name) ? ($lookup[mb_strtolower(trim($name))] ?? null) : null;
                if ($skillId) {
                    $rows[$skillId] = ['vacancy_id' => $vacancy->id, 'skill_id' => $skillId, 'created_at' => now(), 'updated_at' => now()];
                }
            }
            if ($rows !== []) {
                DB::table('skill_vacancy')->insert(array_values($rows));
            }
        });

        Schema::table('vacancies', fn (Blueprint $table) => $table->dropColumn('skills'));
    }

    public function down(): void
    {
        Schema::table('vacancies', fn (Blueprint $table) => $table->json('skills')->nullable());

        DB::table('vacancies')->orderBy('id')->each(function (object $vacancy): void {
            $names = DB::table('skill_vacancy')
                ->join('skills', 'skills.id', '=', 'skill_vacancy.skill_id')
                ->where('skill_vacancy.vacancy_id', $vacancy->id)
                ->pluck('skills.name')
                ->map(function ($name): string {
                    $translations = is_string($name) ? (json_decode($name, true) ?: []) : (array) $name;
                    return (string) ($translations['az'] ?? reset($translations) ?: '');
                })
                ->filter()
                ->values()
                ->all();

            DB::table('vacancies')->where('id', $vacancy->id)->update(['skills' => json_encode($names)]);
        });

        Schema::dropIfExists('skill_vacancy');
    }
};
