<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->json('title')->nullable();
            $table->string('slug')->unique();
            $table->string('category')->nullable()->index();
            $table->string('image_url')->nullable();
            $table->json('description')->nullable();
            $table->json('content')->nullable();
            $table->unsignedBigInteger('views')->default(0);
            $table->string('source_name')->nullable();
            $table->string('source_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
