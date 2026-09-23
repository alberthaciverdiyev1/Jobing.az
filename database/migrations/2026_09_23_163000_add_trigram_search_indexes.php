<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // pg_trgm süper kullanıcı gerektirir; yoksa sessizce atlanır (kurulum adımında eklenir).
        if (! $this->hasTrgm()) {
            try {
                DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
            } catch (\Throwable) {
                // yetki yoksa indeksler bir sonraki adımda atlanır
            }
        }

        if (! $this->hasTrgm()) {
            return;
        }

        DB::statement('CREATE INDEX IF NOT EXISTS sv_title_trgm_idx ON public.scraped_vacancies USING gin (title gin_trgm_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS sv_company_trgm_idx ON public.scraped_vacancies USING gin (company_name gin_trgm_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS vacancies_title_trgm_idx ON public.vacancies USING gin (title gin_trgm_ops)');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS sv_title_trgm_idx');
        DB::statement('DROP INDEX IF EXISTS sv_company_trgm_idx');
        DB::statement('DROP INDEX IF EXISTS vacancies_title_trgm_idx');
    }

    private function hasTrgm(): bool
    {
        return (bool) DB::selectOne("SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'");
    }
};
