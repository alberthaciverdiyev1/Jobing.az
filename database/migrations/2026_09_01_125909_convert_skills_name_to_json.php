<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $existingSkills = DB::table('skills')->get();

        Schema::table('skills', function (Blueprint $table) {
            $table->dropUnique(['name']);
        });

        DB::statement('ALTER TABLE skills ALTER COLUMN name TYPE json USING json_build_object(\'az\', name)');

        foreach ($existingSkills as $skill) {
            $nameStr = is_string($skill->name) ? $skill->name : '';
            if ($nameStr) {
                $json = json_encode([
                    'az' => $nameStr,
                    'en' => $nameStr,
                    'tr' => $nameStr,
                    'ru' => $nameStr,
                ], JSON_UNESCAPED_UNICODE);

                DB::table('skills')->where('id', $skill->id)->update(['name' => $json]);
            }
        }
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE skills ALTER COLUMN name TYPE varchar(255) USING name->>\'az\'');
    }
};
