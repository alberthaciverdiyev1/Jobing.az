<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        \Illuminate\Support\Facades\DB::table('vacancy_favorites')->whereNull('user_id')->delete();

        Schema::table('vacancy_favorites', function (Blueprint $table) {
            if (Schema::hasColumn('vacancy_favorites', 'session_id')) {
                $table->dropColumn('session_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vacancy_favorites', function (Blueprint $table) {
            $table->string('session_id', 100)->nullable()->index();
        });
    }
};
