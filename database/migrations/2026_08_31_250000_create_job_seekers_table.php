<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_seekers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('position')->nullable();

            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('job_type_id')->nullable()->constrained('job_types')->nullOnDelete();
            $table->foreignId('workplace_type_id')->nullable()->constrained('workplace_types')->nullOnDelete();
            $table->foreignId('experience_level_id')->nullable()->constrained('experience_levels')->nullOnDelete();

            $table->json('skills')->nullable();
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->boolean('salary_negotiable')->default(false);
            $table->string('currency', 10)->default('AZN');
            $table->string('location', 255)->nullable();
            $table->string('availability', 50)->default('immediate');

            $table->string('contact_name');
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();

            $table->string('status')->default('published')->index();
            $table->unsignedBigInteger('views_count')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'status']);
            $table->index(['job_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_seekers');
    }
};
