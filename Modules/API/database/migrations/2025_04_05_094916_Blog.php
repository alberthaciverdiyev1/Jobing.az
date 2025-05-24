<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('az_title');
            $table->string('ru_title')->nullable();
            $table->string('en_title')->nullable();
            $table->text('az_content');
            $table->text('ru_content')->nullable();
            $table->text('en_content')->nullable();
            $table->string('main_image');
            $table->boolean('is_active')->default(true);
            $table->boolean('show_in_home_page')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
