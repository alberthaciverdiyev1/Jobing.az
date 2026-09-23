<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scraped_vacancies', function (Blueprint $table) {
            $table->index('job_type_id', 'sv_job_type_idx');
            $table->index('workplace_type_id', 'sv_workplace_idx');
            $table->index('experience_level_id', 'sv_experience_idx');
            $table->index('city_id', 'sv_city_idx');
            $table->index(['is_active', 'is_featured', 'updated_at'], 'sv_listing_idx');
            $table->index(['is_active', 'deadline'], 'sv_deadline_idx');
        });
    }

    public function down(): void
    {
        Schema::table('scraped_vacancies', function (Blueprint $table) {
            $table->dropIndex('sv_job_type_idx');
            $table->dropIndex('sv_workplace_idx');
            $table->dropIndex('sv_experience_idx');
            $table->dropIndex('sv_city_idx');
            $table->dropIndex('sv_listing_idx');
            $table->dropIndex('sv_deadline_idx');
        });
    }
};
