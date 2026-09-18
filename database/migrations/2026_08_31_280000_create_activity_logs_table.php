<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Aktivlik loqları AYRI verilənlər bazasında ("logs" bağlantısı) saxlanılır.
 * Qeyd: users cədvəli əsas bazadadır → cross-DB olduğu üçün FK qoyulmur.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('logs')->create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();

            // Geo
            $table->string('ip_address', 45)->nullable();
            $table->string('country_code', 5)->nullable();
            $table->string('country_name', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('region', 100)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('isp', 150)->nullable();

            // Cihaz
            $table->string('user_agent', 500)->nullable();
            $table->string('device_type', 20)->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('os', 50)->nullable();

            // Sorğu
            $table->string('method', 10)->nullable();
            $table->text('url')->nullable();
            $table->text('referer')->nullable();

            // Aksiya
            $table->string('action', 50)->nullable();
            $table->string('model_type', 150)->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('payload')->nullable();
            $table->unsignedInteger('duration_ms')->nullable();
            $table->string('status_code', 10)->nullable();
            $table->timestamp('created_at')->useCurrent()->nullable();

            $table->index(['action', 'created_at']);
            $table->index('created_at');
            $table->index('ip_address');
        });
    }

    public function down(): void
    {
        Schema::connection('logs')->dropIfExists('activity_logs');
    }
};
