<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Job Types (İş Rejimi)
        Schema::create('job_types', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // Multilingual: az, tr, en, ru
            $table->string('slug')->unique();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Workplace Types (Çalışma Yeri / Məkanı)
        Schema::create('workplace_types', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // Multilingual: az, tr, en, ru
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Experience Levels (Deneyim / Təcrübə Səviyyəsi)
        Schema::create('experience_levels', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // Multilingual: az, tr, en, ru
            $table->string('slug')->unique();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Update Vacancies table with foreign keys
        Schema::table('vacancies', function (Blueprint $table) {
            $table->foreignId('job_type_id')->nullable()->after('category_id')->constrained('job_types')->nullOnDelete();
            $table->foreignId('workplace_type_id')->nullable()->after('job_type_id')->constrained('workplace_types')->nullOnDelete();
            $table->foreignId('experience_level_id')->nullable()->after('workplace_type_id')->constrained('experience_levels')->nullOnDelete();
            $table->string('job_type')->nullable()->change();
            $table->string('workplace_type')->nullable()->change();
            $table->string('experience_level')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropForeign(['job_type_id']);
            $table->dropForeign(['workplace_type_id']);
            $table->dropForeign(['experience_level_id']);
            $table->dropColumn(['job_type_id', 'workplace_type_id', 'experience_level_id']);
        });

        Schema::dropIfExists('experience_levels');
        Schema::dropIfExists('workplace_types');
        Schema::dropIfExists('job_types');
    }
};
