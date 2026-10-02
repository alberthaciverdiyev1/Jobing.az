<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Eyni adlı skill-lər müxtəlif kateqoriyalarda təkrarlandığı üçün
     * (məs. "SEO" 10 fərqli ID) köhnə kod adı bütün variantlarla uyğunlaşdırır
     * və tək seçim onlarla kopya kimi yazılırdı. Bu miqrasiya hər vakansiya
     * üçün eyni adlı bacarıqlardan yalnız birini saxlayır.
     */
    public function up(): void
    {
        $rows = DB::table('skill_vacancy as sv')
            ->join('skills as s', 's.id', '=', 'sv.skill_id')
            ->select('sv.id', 'sv.vacancy_id', 's.name')
            ->orderBy('sv.id')
            ->get();

        $seen = [];
        $deleteIds = [];

        foreach ($rows as $row) {
            $name = $row->name;
            if (is_string($name)) {
                $decoded = json_decode($name, true);
                $name = is_array($decoded) ? ($decoded['az'] ?? reset($decoded) ?? '') : $name;
            }

            $key = $row->vacancy_id . '|' . mb_strtolower(trim((string) $name));

            if (isset($seen[$key])) {
                $deleteIds[] = $row->id;
            } else {
                $seen[$key] = true;
            }
        }

        foreach (array_chunk($deleteIds, 500) as $chunk) {
            DB::table('skill_vacancy')->whereIn('id', $chunk)->delete();
        }
    }

    public function down(): void
    {
        // Silinən kopyalar bərpa olunmur.
    }
};
