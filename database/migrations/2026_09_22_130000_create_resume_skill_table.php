<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resume_skill', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained('resumes')->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained('skills')->cascadeOnDelete();
            $table->string('level', 32)->default('advanced');
            $table->timestamps();
            $table->unique(['resume_id', 'skill_id']);
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

        DB::table('resumes')->whereNotNull('skills')->orderBy('id')->each(function ($resume) use ($lookup) {
            $items = is_string($resume->skills) ? (json_decode($resume->skills, true) ?: []) : (array) $resume->skills;
            $rows = [];
            foreach ($items as $item) {
                $name = is_array($item) ? ($item['skill'] ?? $item['name'] ?? null) : $item;
                $level = is_array($item) ? ($item['level'] ?? 'advanced') : 'advanced';
                $skillId = is_string($name) ? ($lookup[mb_strtolower(trim($name))] ?? null) : null;
                if ($skillId) {
                    $rows[$skillId] = [
                        'resume_id' => $resume->id,
                        'skill_id' => $skillId,
                        'level' => $level,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            if ($rows !== []) {
                DB::table('resume_skill')->insert(array_values($rows));
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resume_skill');
    }
};
