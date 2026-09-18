<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotion_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('mode');            // premium | boost
            $table->unsignedInteger('times')->default(1);   // 1/3/7 paket
            $table->decimal('price', 10, 2)->nullable();
            $table->string('phone')->nullable();
            $table->string('status')->default('pending')->index(); // pending|approved|rejected
            $table->text('note')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_requests');
    }
};
