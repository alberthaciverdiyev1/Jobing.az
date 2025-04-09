<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('unique_key');
            $table->string('title');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->longText('description')->nullable();
            $table->string('location')->nullable();
            $table->integer('min_salary')->nullable();
            $table->integer('max_salary')->nullable();
            $table->integer('min_age')->nullable();
            $table->integer('max_age')->nullable();
            $table->string('currency_sign')->default('₼');
            $table->integer('category_id')->nullable();
            $table->integer('sub_category_id')->nullable();
            $table->string('company_name')->nullable();
            $table->string('company_id')->nullable();
            $table->integer('city_id')->nullable();
            $table->integer('education_id')->nullable();
            $table->integer('experience_id')->nullable();
            $table->string('user_name')->nullable();
            $table->boolean('is_premium')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('job_type')->nullable();
            $table->dateTime('posted_at')->nullable();
            $table->string('source_url');
            $table->string('redirect_url');
            $table->timestamps();
            $table->softDeletes();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
