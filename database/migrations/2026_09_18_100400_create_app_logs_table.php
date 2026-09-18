<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sistem loqları (level/source/message/metadata) — AYRI "logs" bazasında.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('logs')->create('app_logs', function (Blueprint $table) {
            $table->id();
            $table->string('level')->default('info')->index();
            $table->string('source')->nullable();
            $table->text('message');
            $table->json('metadata')->nullable();
            $table->string('url')->nullable();
            $table->string('method', 10)->nullable();
            $table->string('ip')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::connection('logs')->dropIfExists('app_logs');
    }
};
