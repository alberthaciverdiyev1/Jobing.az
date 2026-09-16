<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('user_type');
        });

        // Give the seeded admin account panel access.
        \Illuminate\Support\Facades\DB::table('users')
            ->where('email', 'admin@jobing.com')
            ->update(['is_admin' => true, 'user_type' => 'admin']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }
};
