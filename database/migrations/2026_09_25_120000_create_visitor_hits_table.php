<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_hits', function (Blueprint $table) {
            $table->id();
            $table->string('ip', 45)->index();
            $table->text('user_agent')->nullable();
            $table->string('path')->nullable();
            $table->timestamp('created_at')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_hits');
    }
};
