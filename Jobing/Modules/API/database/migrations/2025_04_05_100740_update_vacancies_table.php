<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn('slug');
        });    }
};
