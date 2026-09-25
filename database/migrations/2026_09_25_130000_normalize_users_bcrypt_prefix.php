<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Köhnə sistemdən (Node `bcrypt`) gələn istifadəçi parolları `$2b$`/`$2a$`
     * prefix-i ilə saxlanılıb. PHP-nin bcrypt implementasiyası yalnız `$2y$`
     * tanıdığı üçün bu istifadəçilər giriş edə bilmir (500). Hash gövdəsi eyni
     * olduğundan prefix-i `$2y$`-ə çevirmək parolları qoruyur.
     */
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        foreach (['$2b$', '$2a$', '$2x$'] as $prefix) {
            DB::table('users')
                ->where('password', 'like', $prefix . '%')
                ->update(['password' => DB::raw("replace(password, '" . $prefix . "', '$2y$')")]);
        }
    }

    public function down(): void
    {
        // Geri qaytarmaq tələb olunmur (parollar artıq işləyir).
    }
};
