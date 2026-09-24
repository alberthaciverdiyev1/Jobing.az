<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\JobAttribute\Models\City;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\WorkplaceType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Yalnız zəruri (referans) məlumatları yaradır — saxta vakansiya/şirkət YOXDUR.
 * Şirkət olaraq yalnız "Jobing" saxlanılır.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin istifadəçi
        User::updateOrCreate(
            ['email' => 'admin@jobing.com'],
            [
                'name' => 'Jobing Admin',
                'password' => Hash::make('password'),
                'user_type' => 'admin',
                'is_admin' => true,
            ]
        );

        // 2. Kateqoriyalar və Şəhərlər (referans məlumat)
        $this->call([
            CategorySeeder::class,
            CitySeeder::class,
        ]);

        // 3. İş atributları (Azərbaycanca slug-lar)
        $jobTypesData = [
            ['slug' => 'tam-zamanli', 'name' => ['az' => 'Tam Ştat', 'tr' => 'Tam Zamanlı', 'en' => 'Full-time', 'ru' => 'Полная занятость'], 'order' => 1],
            ['slug' => 'yari-zamanli', 'name' => ['az' => 'Yarım Ştat', 'tr' => 'Yarı Zamanlı', 'en' => 'Part-time', 'ru' => 'Частичная занятость'], 'order' => 2],
            ['slug' => 'sozlesmeli', 'name' => ['az' => 'Müqavilə əsasında', 'tr' => 'Sözleşmeli / Proje', 'en' => 'Contract / Project', 'ru' => 'Контракт / Проект'], 'order' => 3],
            ['slug' => 'staj', 'name' => ['az' => 'Təcrübəçi (Təcrübə proqramı)', 'tr' => 'Staj (Internship)', 'en' => 'Internship', 'ru' => 'Стажировка'], 'order' => 4],
            ['slug' => 'serbest', 'name' => ['az' => 'Sərbəst (Frilans)', 'tr' => 'Freelance', 'en' => 'Freelance', 'ru' => 'Фриланс'], 'order' => 5],
        ];
        foreach ($jobTypesData as $jt) {
            JobType::updateOrCreate(['slug' => $jt['slug']], $jt);
        }

        $workplaceTypesData = [
            ['slug' => 'uzaktan', 'name' => ['az' => 'Məsafədən (Uzaqdan)', 'tr' => 'Uzaktan (Remote)', 'en' => 'Remote', 'ru' => 'Удаленно'], 'icon' => 'fa-laptop', 'order' => 1],
            ['slug' => 'hibrit', 'name' => ['az' => 'Hibrid', 'tr' => 'Hibrit', 'en' => 'Hybrid', 'ru' => 'Гибридный'], 'icon' => 'fa-building-user', 'order' => 2],
            ['slug' => 'ofiste', 'name' => ['az' => 'Ofis daxili', 'tr' => 'Ofiste (On-site)', 'en' => 'On-site', 'ru' => 'В офисе'], 'icon' => 'fa-building', 'order' => 3],
        ];
        foreach ($workplaceTypesData as $wt) {
            WorkplaceType::updateOrCreate(['slug' => $wt['slug']], $wt);
        }

        $experienceLevelsData = [
            ['slug' => 'baslangic', 'name' => ['az' => 'Başlanğıc səviyyə', 'tr' => 'Başlangıç (Junior)', 'en' => 'Entry / Junior', 'ru' => 'Начальный (Junior)'], 'order' => 1],
            ['slug' => 'orta', 'name' => ['az' => 'Orta səviyyə', 'tr' => 'Orta Seviye (Mid)', 'en' => 'Mid-Level', 'ru' => 'Средний (Mid)'], 'order' => 2],
            ['slug' => 'yuksek', 'name' => ['az' => 'Yüksək səviyyə', 'tr' => 'Kıdemli (Senior)', 'en' => 'Senior', 'ru' => 'Старший (Senior)'], 'order' => 3],
            ['slug' => 'rehber', 'name' => ['az' => 'Rəhbər / Menecer', 'tr' => 'Yönetici / Lead', 'en' => 'Lead / Manager', 'ru' => 'Руководитель (Lead)'], 'order' => 4],
        ];
        foreach ($experienceLevelsData as $el) {
            ExperienceLevel::updateOrCreate(['slug' => $el['slug']], $el);
        }

        // 4. Yeganə şirkət: Jobing
        $bakuCity = City::where('slug', 'lefkosa')->first();

        Company::updateOrCreate(
            ['slug' => 'jobing'],
            [
                'name' => 'Jobing',
                'website' => config('app.url'),
                'email' => 'info@jobing.az',
                'city_id' => $bakuCity?->id,
                'about' => [
                    'az' => 'Jobing.az — Azərbaycanda iş elanları və karyera platforması.',
                    'tr' => 'Jobing.az — Azerbaycan\'da iş ilanları ve kariyer platformu.',
                    'en' => 'Jobing.az — Job listings and career platform in Azerbaijan.',
                    'ru' => 'Jobing.az — платформа вакансий и карьеры в Азербайджане.',
                ],
                'is_verified' => true,
            ]
        );

        // 5. Qlobal mesaj şablonları (referans)
        $this->call(MessageTemplateSeeder::class);
        $this->call(SkillSeeder::class);
    }
}
