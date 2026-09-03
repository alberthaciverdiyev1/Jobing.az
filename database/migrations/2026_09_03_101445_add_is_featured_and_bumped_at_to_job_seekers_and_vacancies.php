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
        Schema::table('vacancies', function (Blueprint $table) {
            if (!Schema::hasColumn('vacancies', 'bumped_at')) {
                $table->timestamp('bumped_at')->nullable()->after('views_count');
            }
            if (!Schema::hasColumn('vacancies', 'featured_until')) {
                $table->timestamp('featured_until')->nullable()->after('is_featured');
            }
        });

        Schema::table('job_seekers', function (Blueprint $table) {
            if (!Schema::hasColumn('job_seekers', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('status');
            }
            if (!Schema::hasColumn('job_seekers', 'bumped_at')) {
                $table->timestamp('bumped_at')->nullable()->after('is_featured');
            }
            if (!Schema::hasColumn('job_seekers', 'featured_until')) {
                $table->timestamp('featured_until')->nullable()->after('bumped_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            if (Schema::hasColumn('vacancies', 'bumped_at')) {
                $table->dropColumn('bumped_at');
            }
            if (Schema::hasColumn('vacancies', 'featured_until')) {
                $table->dropColumn('featured_until');
            }
        });

        Schema::table('job_seekers', function (Blueprint $table) {
            if (Schema::hasColumn('job_seekers', 'featured_until')) {
                $table->dropColumn('featured_until');
            }
            if (Schema::hasColumn('job_seekers', 'bumped_at')) {
                $table->dropColumn('bumped_at');
            }
            if (Schema::hasColumn('job_seekers', 'is_featured')) {
                $table->dropColumn('is_featured');
            }
        });
    }
};
