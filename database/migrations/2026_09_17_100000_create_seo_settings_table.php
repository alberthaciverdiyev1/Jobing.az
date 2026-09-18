<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();

            // Global skriptlər (RAW HTML/JS) — GA, GTM, Pixel, canlı çat vb.
            $table->mediumText('head_scripts')->nullable();
            $table->mediumText('body_scripts')->nullable();
            $table->mediumText('footer_scripts')->nullable();

            // Qlobal standart meta (çoxdilli)
            $table->json('default_meta_title')->nullable();
            $table->json('default_meta_description')->nullable();
            $table->json('default_meta_keywords')->nullable();

            $table->string('og_image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
    }
};
