<?php

namespace Database\Seeders;

use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\JobAttribute\Models\City;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\WorkplaceType;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoVacancySeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::where('slug', 'jobing')->firstOrFail();
        $categories = Category::whereNotNull('parent_id')->get();
        $cities = City::active()->get();
        $jobTypes = JobType::active()->get();
        $workplaces = WorkplaceType::active()->get();
        $experiences = ExperienceLevel::active()->get();

        if ($categories->isEmpty() || $cities->isEmpty() || $jobTypes->isEmpty() || $workplaces->isEmpty() || $experiences->isEmpty()) {
            $this->command?->warn('Reference data is missing. Run DatabaseSeeder before DemoVacancySeeder.');
            return;
        }

        $jobs = [
            ['Senior PHP / Laravel Developer', ['PHP', 'Laravel', 'PostgreSQL', 'Docker'], 2500, 4000],
            ['Frontend Developer', ['JavaScript', 'React', 'TypeScript', 'Tailwind CSS'], 1800, 3000],
            ['Data Analyst', ['SQL', 'Power BI', 'Excel', 'Python'], 1600, 2800],
            ['UI/UX Designer', ['Figma', 'UI/UX', 'Prototyping', 'User Research'], 1400, 2400],
            ['DevOps Engineer', ['Linux', 'Docker', 'Kubernetes', 'CI/CD'], 2800, 4500],
            ['Mühasib', ['1C', 'Excel', 'Vergi Hesabatlılığı', 'IFRS'], 1000, 1800],
            ['Satış meneceri', ['CRM', 'B2B Satış', 'Negotiation', 'KPI İdarəetməsi'], 900, 1800],
            ['SMM mütəxəssisi', ['SMM', 'Content Marketing', 'Meta Ads', 'Canva'], 900, 1600],
            ['HR mütəxəssisi', ['Recruitment', 'HR', 'Ünsiyyət', 'Microsoft Office'], 1000, 1800],
            ['Logistika üzrə mütəxəssis', ['Logistika', 'Supply Chain', 'WMS', 'Route Planning'], 1200, 2200],
            ['Backend Developer', ['Node.js', 'REST API', 'PostgreSQL', 'Redis'], 2000, 3500],
            ['Mobile Developer', ['JavaScript', 'REST API', 'Git', 'Agile'], 1800, 3200],
            ['Kibertəhlükəsizlik mütəxəssisi', ['Linux', 'Şəbəkə', 'Risk İdarəetməsi', 'Audit'], 2200, 3800],
            ['Layihə meneceri', ['Agile', 'KPI', 'Ünsiyyət', 'Problem Həlli'], 1800, 3000],
            ['Müştəri xidməti mütəxəssisi', ['Müştəri Xidməti', 'CRM', 'Ünsiyyət', 'Problem Həlli'], 700, 1200],
            ['Təcrübəçi proqramçı', ['PHP', 'JavaScript', 'Git', 'SQL'], 500, 800],
        ];

        foreach ($jobs as $index => [$title, $skills, $salaryMin, $salaryMax]) {
            Vacancy::updateOrCreate(
                ['slug' => 'demo-' . Str::slug($title)],
                [
                    'company_id' => $company->id,
                    'category_id' => $categories[$index % $categories->count()]->id,
                    'city_id' => $cities[$index % $cities->count()]->id,
                    'job_type_id' => $jobTypes[$index % $jobTypes->count()]->id,
                    'workplace_type_id' => $workplaces[$index % $workplaces->count()]->id,
                    'experience_level_id' => $experiences[$index % $experiences->count()]->id,
                    'title' => $title,
                    'description' => 'Jobing.az filtr və siyahı funksiyalarını yoxlamaq üçün yaradılmış nümunə vakansiyadır.',
                    'requirements' => 'Müvafiq sahədə bilik, məsuliyyətli yanaşma və komanda ilə işləmək bacarığı.',
                    'skills' => $skills,
                    'salary_min' => $salaryMin,
                    'salary_max' => $salaryMax,
                    'salary_negotiable' => false,
                    'currency' => 'TRY',
                    'is_featured' => $index < 3,
                    'is_active' => true,
                    'views_count' => 25 + ($index * 17),
                    'deadline' => now()->addDays(30 + $index)->toDateString(),
                    'application_type' => 'email',
                    'application_email' => 'info@jobing.az',
                ]
            );
        }

        $this->command?->info(count($jobs) . ' idempotent demo vacancies are ready.');
    }
}
