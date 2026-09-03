<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacancy_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('session_id', 100)->nullable()->index();
            $table->foreignId('vacancy_id')->constrained('vacancies')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'vacancy_id']);
            $table->index(['session_id', 'vacancy_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancy_favorites');
    }
};
