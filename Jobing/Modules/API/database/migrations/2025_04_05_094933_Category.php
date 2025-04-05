<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->unsignedBigInteger('local_category_id')->nullable();
            $table->string('category_name')->nullable();
            $table->string('smart_job_az')->nullable();
            $table->string('offer_az')->nullable();
            $table->string('job_search')->nullable();
            $table->string('boss_az')->nullable();
            $table->string('hello_job_az')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
