<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scraped_vacancies', function (Blueprint $table) {
            $table->id();

            // Scraped listings intentionally keep a company snapshot instead
            // of belonging to a company account in this application.
            $table->string('company_name');
            $table->string('company_logo', 2048)->nullable();
            $table->text('redirect_url');

            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('job_type_id')->nullable()->constrained('job_types')->nullOnDelete();
            $table->foreignId('workplace_type_id')->nullable()->constrained('workplace_types')->nullOnDelete();
            $table->foreignId('experience_level_id')->nullable()->constrained('experience_levels')->nullOnDelete();

            $table->string('title');
            $table->string('slug')->unique();
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->boolean('salary_negotiable')->default(false);
            $table->string('currency', 10)->default('AZN');
            $table->longText('description');
            $table->longText('requirements')->nullable();
            $table->json('skills')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamp('featured_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('rejection_reason')->nullable();
            $table->date('deadline')->nullable();
            $table->string('application_type')->default('email');
            $table->string('application_email')->nullable();
            $table->json('application_fields')->nullable();
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamp('bumped_at')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'created_at']);
            $table->index(['category_id', 'city_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scraped_vacancies');
    }
};
