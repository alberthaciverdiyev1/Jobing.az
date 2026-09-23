<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scraper_runs', function (Blueprint $table) {
            $table->id();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->string('region')->nullable();
            $table->string('mode')->nullable();
            $table->unsignedInteger('fetched')->default(0);
            $table->unsignedInteger('ready')->default(0);
            $table->unsignedInteger('inserted')->default(0);
            $table->unsignedInteger('duplicates')->default(0);
            $table->unsignedInteger('skipped')->default(0);
            $table->unsignedInteger('errors')->default(0);
            $table->timestamps();
        });

        Schema::create('scraper_source_status', function (Blueprint $table) {
            $table->id();
            $table->string('source')->unique();
            $table->string('label')->nullable();
            $table->string('region')->nullable();
            $table->timestamp('last_run_at')->nullable();
            $table->unsignedInteger('fetched')->default(0);
            $table->unsignedInteger('ready')->default(0);
            $table->unsignedInteger('inserted')->default(0);
            $table->unsignedInteger('duplicates')->default(0);
            $table->unsignedInteger('skipped')->default(0);
            $table->unsignedInteger('errors')->default(0);
            $table->string('report_path')->nullable();
            $table->timestamps();
        });

        Schema::create('scraper_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scraper_settings');
        Schema::dropIfExists('scraper_source_status');
        Schema::dropIfExists('scraper_runs');
    }
};
