<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('page_seos', function (Blueprint $table) {
            $table->json('h1')->nullable()->after('route_name');
        });
    }

    public function down(): void
    {
        Schema::table('page_seos', function (Blueprint $table) {
            $table->dropColumn('h1');
        });
    }
};
