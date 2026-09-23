<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scraper_source_runs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('scraper_run_id')->nullable()->index();
            $table->string('source')->index();
            $table->timestamp('run_at')->nullable()->index();
            $table->unsignedInteger('fetched')->default(0);
            $table->unsignedInteger('ready')->default(0);
            $table->unsignedInteger('inserted')->default(0);
            $table->unsignedInteger('duplicates')->default(0);
            $table->unsignedInteger('skipped')->default(0);
            $table->unsignedInteger('errors')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scraper_source_runs');
    }
};
