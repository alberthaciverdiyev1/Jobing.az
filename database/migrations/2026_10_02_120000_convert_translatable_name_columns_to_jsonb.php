<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * `categories.name` jsonb-dir, lakin digər referans cədvəllərin `name`
     * sütunları `json` idi. `json` üzərində PostgreSQL nə DISTINCT (bərabərlik),
     * nə də ORDER BY (sıralama) operatorunu dəstəkləmir. Bu, Filament-in
     * `relationship()` Select-ində (`select distinct skills.* ... order by
     * skills.name`) 500 xətasına səbəb olurdu.
     */
    private array $tables = ['skills', 'cities', 'job_types', 'workplace_types', 'experience_levels'];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            if ($this->columnType($table) === 'json') {
                DB::statement("ALTER TABLE {$table} ALTER COLUMN name TYPE jsonb USING name::jsonb");
            }
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $table) {
            if ($this->columnType($table) === 'jsonb') {
                DB::statement("ALTER TABLE {$table} ALTER COLUMN name TYPE json USING name::json");
            }
        }
    }

    private function columnType(string $table): ?string
    {
        $row = DB::selectOne(
            'select data_type from information_schema.columns where table_name = ? and column_name = ?',
            [$table, 'name']
        );

        return $row->data_type ?? null;
    }
};
