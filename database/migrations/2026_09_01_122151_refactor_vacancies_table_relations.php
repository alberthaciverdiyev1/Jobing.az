<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->foreignId('city_id')->nullable()->after('category_id')->constrained('cities')->nullOnDelete();
        });

        Schema::table('vacancies', function (Blueprint $table) {
            if (Schema::hasColumn('vacancies', 'job_type')) {
                $table->dropColumn('job_type');
            }
            if (Schema::hasColumn('vacancies', 'workplace_type')) {
                $table->dropColumn('workplace_type');
            }
            if (Schema::hasColumn('vacancies', 'experience_level')) {
                $table->dropColumn('experience_level');
            }
            if (Schema::hasColumn('vacancies', 'location')) {
                $table->dropColumn('location');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropForeign(['city_id']);
            $table->dropColumn('city_id');
            $table->string('job_type')->nullable();
            $table->string('workplace_type')->nullable();
            $table->string('experience_level')->nullable();
            $table->string('location')->nullable();
        });
    }
};
