<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->unsignedBigInteger('views_count')->default(0);
        });

        // Mövcud unikal baxışları ilkin dəyər kimi köçürürük.
        DB::table('stories')->update([
            'views_count' => DB::raw('(select count(*) from story_views where story_views.story_id = stories.id)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->dropColumn('views_count');
        });
    }
};
