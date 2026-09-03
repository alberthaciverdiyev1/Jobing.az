<?php

namespace Database\Seeders;

use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\JobAttribute\Models\City;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\Skill;
use App\Modules\JobAttribute\Models\WorkplaceType;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RandomVacanciesSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure a diverse set of companies
        $companyNames = [
            ['name' => 'PASHA Bank Digital', 'about' => 'Azərbaycanın aparıcı korporativ investisiya bankının rəqəmsal texnologiyalar departamenti.', 'verified' => true],
            ['name' => 'Kapital Bank Tech', 'about' => 'Birbank və rəqəmsal bankçılıq ekosisteminin innovasiya və mühəndislik mərkəzi.', 'verified' => true],
            ['name' => 'ABB Innovation Lab', 'about' => 'Azərbaycan Beynəlxalq Bankının fintex və müasir rəqəmsal həllər laboratoriyası.', 'verified' => true],
            ['name' => 'Azercell Telecom', 'about' => 'Ölkənin ən böyük mobil telekommunikasiya və rəqəmsal xidmətlər təchizatçısı.', 'verified' => true],
            ['name' => 'Bakcell Digital', 'about' => 'Ultra sürətli mobil şəbəkə və rəqəmsal tətbiqlər üzrə aparıcı telekom şirkəti.', 'verified' => true],
            ['name' => 'ATL Tech', 'about' => 'Dövlət və korporativ sektor üçün genişmiqyaslı proqram təminatı və İT konsaltinq şirkəti.', 'verified' => true],
            ['name' => 'Sinam IT Solutions', 'about' => 'Elektron hökumət və iri infrastruktur layihələri üzrə ixtisaslaşmış proqram təminatı şirkəti.', 'verified' => false],
            ['name' => 'Cybernet MMC', 'about' => 'Vergi, gömrük və dövlət reyestrləri üzrə rəqəmsal informasiya sistemləri tərtibatçısı.', 'verified' => false],
            ['name' => 'Bravo Retail Tech', 'about' => 'Pərakəndə satış şəbəkəsinin ERP, e-ticarət və təchizat zənciri texnologiyaları qolu.', 'verified' => true],
            ['name' => 'Umico Market', 'about' => 'Azərbaycanın ən böyük marketplace və e-ticarət platformalarından biri.', 'verified' => true],
            ['name' => 'FoxSoft Teknoloji', 'about' => 'Veb və mobil platformalar, fintex və SaaS məhsulların yaradılması üzrə ixtisaslaşmış komanda.', 'verified' => true],
            ['name' => 'Trendyol Tech', 'about' => 'E-ticarət ekosistemi üçün yüksək yüklü sistemlər və logistika həlləri.', 'verified' => true],
            ['name' => 'Insider Growth', 'about' => 'Süni intellekt dəstəkli çoxkanallı müştəri təcrübəsi və marketinq platforması.', 'verified' => true],
            ['name' => 'Papara FinTech', 'about' => 'Yeni nəsil maliyyə xidmətləri və rəqəmsal ödəniş sistemləri.', 'verified' => true],
            ['name' => 'Peak Games', 'about' => 'Dünya üzrə milyonlarla oyunçuya çatan mobil puzzle oyunlarının yaradıcısı.', 'verified' => true],
        ];

        $cities = City::all();
        $bakiCity = $cities->firstWhere('slug', 'baki') ?? $cities->first();

        $companies = [];
        foreach ($companyNames as $cData) {
            $company = Company::firstOrCreate(
                ['name' => $cData['name']],
                [
                    'about' => ['az' => $cData['about'], 'en' => $cData['about']],
                    'email' => Str::slug($cData['name']) . '@example.com',
                    'website' => 'https://' . Str::slug($cData['name']) . '.az',
                    'city_id' => $bakiCity?->id,
                    'is_verified' => $cData['verified'],
                ]
            );
            $companies[] = $company;
        }

        // Additional existing companies
        $allCompanies = Company::all();

        // 2. Fetch lookup records
        $categories = Category::whereNotNull('parent_id')->get();
        if ($categories->isEmpty()) {
            $categories = Category::all();
        }

        $jobTypes = JobType::all();
        $workplaceTypes = WorkplaceType::all();
        $experienceLevels = ExperienceLevel::all();
        $allSkills = Skill::all();

        // 3. Realistic Vacancy Templates with Category Affiliation
        $templates = [
            // Backend
            [
                'cat_keyword' => 'backend',
                'titles' => [
                    'Senior Backend Developer (PHP / Laravel)',
                    'Middle Golang Developer',
                    'Node.js / Express Backend Mühəndisi',
                    'Python / Django Backend Proqramçı',
                    'Java / Spring Boot Mühəndisi',
                    'Junior Laravel Developer',
                    'Lead Backend Arxitektor',
                    'API & Mikroservis Mühəndisi',
                ],
                'skills' => ['PHP', 'Laravel', 'Go', 'Docker', 'PostgreSQL', 'Redis', 'REST API', 'Git'],
                'desc_overview' => 'Yüksək yüklü sistemlərin arxitekturasını qurmaq və etibarlı mikroservis API-lərini tərtib etmək.',
                'responsibilities' => [
                    'Yüksək sürətli və miqyaslana bilən RESTful və gRPC API-lərin yazılması.',
                    'Verilənlər bazası sorğularının və kəşləmə sistemlərinin optimallaşdırılması.',
                    'Frontend və mobil komandalarla sıx əməkdaşlıq edərək yeni funksionallıqların inteqrasiyası.',
                ],
                'requirements' => [
                    'Müvafiq backend texnologiyaları üzrə praktiki iş təcrübəsi.',
                    'Relyasiyalı verilənlər bazaları (PostgreSQL/MySQL) və kəşləmə (Redis) bilikləri.',
                    'Git, Docker və CI/CD prosesləri ilə işləmə bacarığı.',
                ],
            ],
            // Frontend
            [
                'cat_keyword' => 'frontend',
                'titles' => [
                    'Middle Frontend Developer (Vue.js / Nuxt)',
                    'Senior React.js / Next.js Mühəndisi',
                    'Frontend Web Developer (TypeScript)',
                    'Junior Frontend Proqramçı',
                    'UI Proqramçı (Tailwind CSS / Alpine.js)',
                    'Lead Frontend Mühəndisi',
                ],
                'skills' => ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5/CSS3', 'Next.js'],
                'desc_overview' => 'Müasir istifadəçi interfeyslərini və sürətli tək səhifəli tətbiqləri (SPA) reallaşdırmaq.',
                'responsibilities' => [
                    'Figma dizaynlarının responsiv və animasiyalı veb komponentlərə çevrilməsi.',
                    'Backend API-ləri ilə inteqrasiya və tətbiqin yüklənmə sürətinin optimallaşdırılması.',
                    'Təmiz, təkrar istifadə edilə bilən kod bazasının formalaşdırılması.',
                ],
                'requirements' => [
                    'Vue.js və ya React framework-lərində real layihə təcrübəsi.',
                    'Tailwind CSS, HTML5 semantika və müasir CSS standartlarını mükəmməl bilmək.',
                    'Cross-browser və mobil uyğunluq prinsiplərinə bələdlik.',
                ],
            ],
            // Full Stack
            [
                'cat_keyword' => 'full-stack',
                'titles' => [
                    'Full Stack Developer (Laravel + Vue.js)',
                    'Senior Full Stack Mühəndisi (Node.js + React)',
                    'Full Stack Web Proqramçı',
                    'Middle Full Stack Developer (PHP / Next.js)',
                ],
                'skills' => ['Laravel', 'Vue.js', 'React', 'PHP', 'PostgreSQL', 'Docker', 'REST API'],
                'desc_overview' => 'Layihənin həm server, həm də istifadəçi tərəfini başdan-başa qurmaq və idarə etmək.',
                'responsibilities' => [
                    'Həm backend məntiqini, həm də frontend interfeyslərini müstəqil şəkildə hazırlamaq.',
                    'Verilənlər bazası sxemini planlaşdırmaq və API inteqrasiyalarını tamamlamaq.',
                    'Məhsulun təhlükəsizliyini və performansını nəzarətdə saxlamaq.',
                ],
                'requirements' => [
                    'Həm müasir backend (Laravel/Node), həm də frontend (Vue/React) təcrübəsi.',
                    'Verilənlər bazaları və server mühitləri ilə sərbəst iş bacarığı.',
                    'Problemləri sürətli və effektiv həll etmə qabiliyyəti.',
                ],
            ],
            // DevOps & Cloud
            [
                'cat_keyword' => 'devops',
                'titles' => [
                    'DevOps Mühəndisi (Kubernetes / Docker)',
                    'Cloud Platform Mühəndisi (AWS / GCP)',
                    'Sistem İnzibatçısı & DevOps',
                    'Site Reliability Engineer (SRE)',
                    'CI/CD & İnfrastruktur Mütəxəssisi',
                ],
                'skills' => ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS', 'Terraform', 'PostgreSQL'],
                'desc_overview' => 'Bulud infrastrukturunun davamlılığını təmin etmək və avtomatlaşdırılmış deployment qurmaq.',
                'responsibilities' => [
                    'CI/CD boru xətlərinin (GitLab CI, GitHub Actions) qurulması və optimallaşdırılması.',
                    'Kubernetes klasterlərinin və Docker konteynerlərinin monitorinqi və idarəsi.',
                    'İnfrastrukturun təhlükəsizliyinin və ehtiyat nüsxələnməsinin təmin edilməsi.',
                ],
                'requirements' => [
                    'Linux sistemlərində dərin təcrübə və şəbəkə bilikləri.',
                    'Docker və Kubernetes ilə real istehsalat mühitində iş təcrübəsi.',
                    'Bulud provayderləri (AWS, DigitalOcean və ya Azure) ilə təcrübə.',
                ],
            ],
            // Mobile
            [
                'cat_keyword' => 'mobil',
                'titles' => [
                    'Flutter Mobile Developer',
                    'iOS Mühəndisi (Swift)',
                    'Android Proqramçı (Kotlin)',
                    'React Native Developer',
                    'Senior Mobile Application Developer',
                ],
                'skills' => ['Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'React Native', 'Git'],
                'desc_overview' => 'İstifadəçilərin rahat istifadə edəcəyi yüksək performanslı mobil tətbiqlər hazırlamaq.',
                'responsibilities' => [
                    'iOS və Android üçün stabil və sürətli mobil tətbiqlərin yaradılması.',
                    'Offline rejim və kəşləmə mexanizmlərinin tətbiqi.',
                    'App Store və Google Play-ə çıxarış və yeniləmə proseslərinin idarə edilməsi.',
                ],
                'requirements' => [
                    'Flutter, Swift və ya Kotlin üzrə 2+ il təcrübə.',
                    'REST API və WebSocket vasitəsilə mobil inteqrasiyaları yaxşı bilmək.',
                    'Yaddaş idarəetməsi və mobil UX standartlarına diqqət.',
                ],
            ],
            // UI/UX & Design
            [
                'cat_keyword' => 'tasarim',
                'titles' => [
                    'Senior UI/UX Dizayner',
                    'Məhsul Dizayneri (Product Designer)',
                    'UI Dizayner & Dizayn Sistemləri',
                    'Qrafik və Vizual Dizayner',
                    'Junior UI/UX Tədqiqatçı',
                    '3D Motion Dizayner',
                ],
                'skills' => ['Figma', 'UI/UX', 'Adobe Photoshop', 'Adobe Illustrator', 'Prototyping'],
                'desc_overview' => 'İstifadəçi mərkəzli cəlbedici rəqəmsal təcrübələr və dizayn sistemləri yaratmaq.',
                'responsibilities' => [
                    'İstifadəçi axınları (user flows), wireframe və interaktiv prototiplərin qurulması.',
                    'Komanda üçün vahid Dizayn Sisteminin (Design System) inkişaf etdirilməsi.',
                    'Məhsul menecerləri və proqramçılarla dizayn təhvil proseslərinin aparılması.',
                ],
                'requirements' => [
                    'Figma alətindən peşəkar səviyyədə istifadə bacarığı və güclü portfel.',
                    'UX araşdırmaları və istifadəçi testləri təcrübəsi.',
                    'Dizayn trendləri və təmiz tipoqrafiya duyumu.',
                ],
            ],
            // Data & AI
            [
                'cat_keyword' => 'veri',
                'titles' => [
                    'Data Analitik (Power BI / SQL)',
                    'Maşın Öyrənməsi Mühəndisi (ML Engineer)',
                    'Süni İntellekt (AI / LLM) Tədqiqatçısı',
                    'Data Mühəndisi (ETL / Python)',
                    'Business Intelligence (BI) Mütəxəssisi',
                ],
                'skills' => ['Python', 'SQL', 'Machine Learning', 'Power BI', 'Data Analysis', 'Docker'],
                'desc_overview' => 'Məlumat axınlarını analiz edərək biznes qərarlarını və AI modellərini gücləndirmək.',
                'responsibilities' => [
                    'Böyük verilənlər bazalarından SQL sorğuları ilə analitik hesabatların çıxarılması.',
                    'İnteraktiv Power BI panellərinin hazırlanması.',
                    'Maşın öyrənməsi modellərinin təlimi və istehsalata inteqrasiyası.',
                ],
                'requirements' => [
                    'Python və SQL dillərində güclü analitik bacarıqlar.',
                    'Məlumat vizuallaşdırma və statistika prinsiplərini bilmək.',
                    'Böyük verilənlər ilə işləmə təcrübəsi üstünlükdür.',
                ],
            ],
            // Product & Project Management
            [
                'cat_keyword' => 'proje',
                'titles' => [
                    'Məhsul Meneceri (Product Manager)',
                    'Texniki Layihə Meneceri (Technical PM)',
                    'Scrum Master & Çevik İdarəçi',
                    'İT Layihə Koordinatoru',
                    'Agile Product Owner',
                ],
                'skills' => ['Scrum', 'Agile', 'Jira', 'Product Management', 'Data Analysis'],
                'desc_overview' => 'Məhsulun baxışını formalaşdırmaq və komandanı məqsədlərə doğru yönləndirmək.',
                'responsibilities' => [
                    'Məhsul yol xəritəsinin (Roadmap) və prioritetlərinin müəyyənləşdirilməsi.',
                    'Sprint planlamalarının və retrospektiv iclasların təşkili.',
                    'Maraqlı tərəflər ilə mühəndislik komandası arasında körpü rolunu oynamaq.',
                ],
                'requirements' => [
                    'Rəqəmsal məhsul idarəetməsində 2+ il uğurlu təcrübə.',
                    'Agile / Scrum metodologiyalarına və Jira alətinə bələdlik.',
                    'Yüksək kommunikasiya və liderlik keyfiyyətləri.',
                ],
            ],
            // Marketing & Sales
            [
                'cat_keyword' => 'pazarlama',
                'titles' => [
                    'Rəqəmsal Marketinq Mütəxəssisi',
                    'Performans Marketinq Meneceri (Google Ads / Meta)',
                    'SEO & Məzmun Strategiyası Mütəxəssisi',
                    'SMM Menecer & Kopirayter',
                    'Böyümə (Growth) Meneceri',
                ],
                'skills' => ['Digital Marketing', 'SEO', 'Google Ads', 'Meta Ads', 'Social Media', 'Content Strategy'],
                'desc_overview' => 'Rəqəmsal kanallarda brendin böyüməsini və hədəfli auditoriya cəlbini təmin etmək.',
                'responsibilities' => [
                    'Google Ads və Meta platformalarında hədəfli reklam kampaniyalarının idarəsi.',
                    'SEO strategiyasının qurulması və üzvi trafikin artırılması.',
                    'Marketinq büdcəsinin səmərəli bölüşdürülməsi və ROI analizi.',
                ],
                'requirements' => [
                    'Rəqəmsal reklam alətləri və analitika (GA4) təcrübəsi.',
                    'Yaradıcı düşüncə və rəqəmlərlə işləmə bacarığı.',
                    'Azərbaycan dilində qüsursuz yazı və kopiraytinq bacarığı.',
                ],
            ],
        ];

        // 4. Generate 100 Realistic Jobs
        $targetCount = 100;
        $createdCount = 0;

        $salaryBrackets = [
            ['min' => 800, 'max' => 1400],
            ['min' => 1200, 'max' => 2000],
            ['min' => 1800, 'max' => 2800],
            ['min' => 2500, 'max' => 3800],
            ['min' => 3500, 'max' => 5500],
            ['min' => null, 'max' => null, 'negotiable' => true],
        ];

        while ($createdCount < $targetCount) {
            $template = $templates[array_rand($templates)];
            $title = $template['titles'][array_rand($template['titles'])];

            // Match category by keyword
            $matchingCategory = $categories->first(function ($c) use ($template) {
                return Str::contains($c->slug, $template['cat_keyword']);
            }) ?? $categories->random();

            $company = $allCompanies->random();
            $city = $cities->random();
            $jobType = $jobTypes->random();
            $workplaceType = $workplaceTypes->random();
            $experienceLevel = $experienceLevels->random();

            // Salary selection
            $bracket = $salaryBrackets[array_rand($salaryBrackets)];
            $isNegotiable = $bracket['negotiable'] ?? false;
            $salaryMin = $isNegotiable ? null : $bracket['min'];
            $salaryMax = $isNegotiable ? null : $bracket['max'];
            $currency = 'AZN';

            // Pick 3-5 relevant skills
            $jobSkills = array_slice($template['skills'], 0, rand(3, 5));

            // Generate concise HTML description
            $descriptionHtml = '<p>' . e($template['desc_overview']) . '</p>' .
                '<p><strong>Əsas Öhdəliklər:</strong></p><ul>';
            foreach ($template['responsibilities'] as $resp) {
                $descriptionHtml .= '<li>' . e($resp) . '</li>';
            }
            $descriptionHtml .= '</ul>';

            $requirementsHtml = '<ul>';
            foreach ($template['requirements'] as $req) {
                $requirementsHtml .= '<li>' . e($req) . '</li>';
            }
            $requirementsHtml .= '</ul>';

            // Application options
            $appTypes = ['internal', 'email', 'both'];
            $appType = $appTypes[array_rand($appTypes)];
            $appEmail = in_array($appType, ['email', 'both'], true) ? $company->email : null;

            // Varied dates (last 30 days)
            $createdDate = now()->subDays(rand(0, 28))->subHours(rand(1, 20));
            $deadline = (clone $createdDate)->addDays(rand(20, 60));

            // Unique slug creation
            $baseSlug = Str::slug($title);
            $slug = $baseSlug . '-' . Str::random(5);

            Vacancy::create([
                'company_id' => $company->id,
                'category_id' => $matchingCategory->id,
                'city_id' => $city->id,
                'job_type_id' => $jobType->id,
                'workplace_type_id' => $workplaceType->id,
                'experience_level_id' => $experienceLevel->id,
                'title' => $title,
                'slug' => $slug,
                'salary_min' => $salaryMin,
                'salary_max' => $salaryMax,
                'salary_negotiable' => $isNegotiable,
                'currency' => $currency,
                'description' => $descriptionHtml,
                'requirements' => $requirementsHtml,
                'skills' => $jobSkills,
                'is_featured' => rand(1, 100) <= 15, // 15% featured
                'is_active' => rand(1, 100) <= 90,   // 90% published/active, 10% pending approval
                'views_count' => rand(15, 850),
                'deadline' => $deadline->toDateString(),
                'application_type' => $appType,
                'application_email' => $appEmail,
                'created_at' => $createdDate,
                'updated_at' => $createdDate,
            ]);

            $createdCount++;
        }

        $this->command->info("100 ədəd unikal vakansiya uğurla generasiya edildi!");
    }
}
