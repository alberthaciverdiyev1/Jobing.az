<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->foreignId('city_id')->nullable()->after('phone')->constrained('cities')->nullOnDelete();
        });

        DB::table('companies')->update(['city_id' => 1]);

        Schema::table('companies', function (Blueprint $table) {
            if (Schema::hasColumn('companies', 'location')) {
                $table->dropColumn('location');
            }
        });

        DB::statement("ALTER TABLE companies ALTER COLUMN about TYPE json USING json_build_object('az', COALESCE(about, ''));");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE companies ALTER COLUMN about TYPE text USING about->>'az';");

        Schema::table('companies', function (Blueprint $table) {
            $table->string('location')->nullable();
            $table->dropForeign(['city_id']);
            $table->dropColumn('city_id');
        });
    }
};
