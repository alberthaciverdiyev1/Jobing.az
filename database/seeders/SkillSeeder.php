<?php

namespace Database\Seeders;

use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Hər kateqoriya (və alt kateqoriya) üçün 20-30 aid bacarıq yaradır.
 * slug unikal olduğu üçün slug-a kateqoriya id-si əlavə olunur.
 */
class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $domain = [
            'Maliyyə və Mühasibatlıq' => ['1C', 'SAP FI', 'Excel', 'Maliyyə Hesabatlılığı', 'Büdcələmə', 'Əməliyyat Analizi', 'Vergi Hesabatlılığı', 'Audit', 'IFRS', 'Bank Əməliyyatları', 'Kredit Analizi', 'Risk İdarəetməsi', 'Mühasibatlıq Proqramları', 'Cash Flow', 'Faktura', 'Əmək Haqqı', 'Maliyyə Proqnozlaşdırma', 'Cost Accounting', 'Rəqəmsal Bankçılıq', 'Audit Sistemi', 'Beyannamə', 'Konsolidasiya', 'ERP', 'Data Analizi', 'Bloomberg'],
            'İnformasiya texnologiyaları' => ['PHP', 'Laravel', 'JavaScript', 'React', 'Vue.js', 'Node.js', 'Python', 'SQL', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL', 'CI/CD', 'AWS', 'Linux', 'TypeScript', 'Tailwind CSS', 'Redis', 'Microservices', 'Bash', 'Agile'],
            'Satış və müştəri xidməti' => ['CRM', 'Satış Strategiyası', 'Müştəri Xidməti', 'Nəqliyyat', 'Telefon Sales', 'Kassa', 'B2B Satış', 'B2C Satış', 'Negotiation', 'Müştəri Məmnuniyyəti', 'Salesforce', 'Lead Generation', 'Upselling', 'KPI İdarəetməsi', 'Pul Vəsaitləri', 'Kassa Əməliyyatları', 'Customer Onboarding', 'Şikayət İdarəetməsi', 'Səs Satışı', 'Target İdarəetməsi', 'Retail', 'Merchandising', 'Inventory', 'POS Sistemi', 'Cross-selling'],
            'Dizayn' => ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'UI/UX', 'Prototyping', 'Wireframing', 'Design System', 'Adobe XD', 'Sketch', 'After Effects', 'Premiere Pro', 'Motion Design', '3D Modeling', 'Blender', 'Typography', 'Branding', 'Illustrator', 'InDesign', 'User Research', 'Interaction Design', 'Responsive Design', 'Color Theory', 'Iconography', 'Web Design', 'Print Design'],
            'Hüquqşünaslıq' => ['Müqavilə Hüququ', 'Əmək Hüququ', 'Korporativ Hüquq', 'Vergi Hüququ', 'Məhkəmə İşləri', 'Hüquqi Ekspertiza', 'Due Diligence', 'Compliance', 'IP Hüququ', 'Hüquqi Sənədləşmə', 'Litigation', 'M&A', 'Data Privacy', 'GDPR', 'Hüquq Araşdırması', 'Notariat', 'Cinayət Hüququ', 'Mülki Hüquq', 'İnzibati Hüquq', 'Beynəlxalq Hüquq', 'Arbitraj', 'Hüquqi Məsləhət', 'Qanunvericilik', 'Contract Drafting', 'Legal Writing'],
            'İnzibati heyət' => ['Microsoft Office', 'Excel', 'Sənəd Dövriyyəsi', 'Ofis İdarəetməsi', 'Meeting Planning', 'Time Management', 'Telefon Etikası', 'Data Entry', 'Arxiv', 'Kargöndərmə', 'Calendar Management', 'Report Preparation', 'İş Planlaması', 'Sekretariat', 'Protokol', 'İnventar', 'Sifariş İdarəetməsi', 'Multitasking', 'Ünsiyyət', 'Problem Həlli', 'Attention to Detail', 'Organizational Skills', 'CRM', 'Email Management', 'Koordinatorluq'],
            'Kənd təsərrüfatı' => ['Aqronomiya', 'Bitki İstehsalatı', 'Torpaq Analizi', 'Suvarama Sistemləri', 'Pestisid İdarəetməsi', 'Heyvandarlıq', 'Kənd Təsərrüfatı Texnikası', 'Fermer Təsərrüfatı', 'Qida Təhlükəsizliyi', 'İxrac Logistikası', 'Greenhouse', 'Organic Farming', 'Məhsul Planlaşdırma', 'Sertifikatlaşdırma', 'Veterinariya', 'Traktor', 'Agroekologiya', 'İqlim Şəraiti', 'Brendinq', 'Kooperativlər', 'Su Resursları', 'Torpaq Bacarıqları', 'İstixana', 'Taxılçılıq', 'Bağçılıq'],
            'Xidmət Personalı' => ['Təmizlik', 'Müştəri Qarşılama', 'Ofis Xidməti', 'Kassir', 'Barista', 'Restoran Servisi', 'Otel Xidməti', 'Sanitariya Standartları', 'Dil Bacarıqları', 'Fiziki Dayanıqlıq', 'Smiling Service', 'Kommunikasiya', 'Time Management', 'Teamwork', 'Attention to Detail', 'Problem Solving', 'İş Təhlükəsizliyi', 'Inventory', 'Order Taking', 'Table Setting', 'Housekeeping', 'Concierge', 'Front Desk', 'Customer Care', 'Sürətli Adaptasiya'],
            'Tibb və əczaçılıq' => ['Tibbi Bacarıqlar', 'Xəstə Qayğısı', 'Tibbi Ehtiyat', 'Təcili Yardım', 'Onkologiya', 'Kardiologiya', 'Nevrologiya', 'Pediatriya', 'Sterilizasiya', 'Infeksiya Nəzarəti', 'Tibbi Sənədləşmə', 'Farmakologiya', 'Laboratoriya', 'Hemşerlik', 'Diaqnostika', 'Radiologiya', 'Cərrahiyyə', 'Fizioterapiya', 'Tibb Texnikası', 'Vaksinasiya', 'Sağlamlıq Məlumatlılığı', 'İlk Yardım', 'Farmasevtik Satış', 'Dərman Hazırlanması', 'Klinik Tədqiqat'],
            'Müxtəlif' => ['Adaptasiya', 'Teamwork', 'Ünsiyyət', 'Problem Həlli', 'Critical Thinking', 'Time Management', 'Microsoft Office', 'Leadership', 'Müraciət İdarəetməsi', 'Self-Motivation', 'Sürətli Öyrənmə', 'Multi-tasking', 'Attention to Detail', 'Logical Thinking', 'Reporting', 'Data Entry', 'Customer Focus', 'Negotiation', 'Planlaşdırma', 'Koordinasiya', 'Research', 'Analyzing', 'Flexibility', 'Etik Davranış', 'Stress İdarəetməsi'],
            'Təhsil və elm' => ['Dərs Dizaynı', 'Təlim Metodları', 'Tədris', 'Elmi Tədqiqat', 'Statistika', 'Pedagogika', 'Mentorluq', 'Seminar İdarəetməsi', 'Tələbə Qiymətləndirilməsi', 'Microsoft Teams', 'Online Tədris', 'Curiculum İnkişafı', 'İngilis Dili', 'Elmi Yazı', 'Laboratoriya İşləri', 'Təhsil Texnologiyaları', 'Sinif İdarəetməsi', 'Üniversitet Sənədləri', 'GIS', 'Data Collection', 'Citation', 'Academic Writing', 'Scientific Method', 'Ki, Seminars', 'Təqdimat Bacarığı'],
            'İdman zalları, fitness, gözəllik salonları' => ['Saç Kəsimi', 'Boya', 'Manikür', 'Pedikür', 'Massaj', 'Fitness Təlimi', 'Kardio', 'Pilates', 'Yoqa', 'Personal Trainer', 'Sanitariya', 'Müştəri Qayğısı', 'Makyaj', 'Kosmetologiya', 'Aparatlar', 'Spa Xidmətləri', 'İdman Avadanlığı', 'Qidalanma', 'Certification', 'Anatomia', 'Təhlükəsizlik', 'Sürətli Xidmət', 'Nail Art', 'Epilasyon', 'Salon İdarəetməsi'],
            'Nəqliyyat, daşınma və logistika' => ['Logistika', 'Gömrük Əməliyyatları', 'İdxal-İxrac', 'Sərmayə İdarəetməsi', 'Logistics Software', 'Forklift', 'Sürücülük', 'B1/D', 'WMS', 'Route Planning', 'Inventory', 'Anbar İdarəetməsi', 'Supply Chain', 'Faktura', 'Cargo', 'Shipping Documents', 'Freight Forwarding', 'Terminal Əməliyyatları', 'İncoTerm', 'Nəqliyyat Təhlükəsizliyi', 'Fuel Management', 'GPS Naviqasiya', 'Dispatch', 'Yükləmə', 'Packaging'],
            'Sənaye, tikinti və istehsalat' => ['Tikinti Mühəndisliyi', 'AutoCAD', 'BIM', 'Tikinti Layihələndirmə', 'Təhlükəsizlik Texnikası', 'Qaynaq', 'Elektrik İşləri', 'Santexnika', 'Betona', 'Metal İşləri', 'İstehsalat', 'Keyfiyyət Nəzarəti', 'Lean Manufacturing', '5S', 'CNC', 'Torna', 'Frezə', 'Kran İdarəetməsi', 'Materiallar', 'Smeta', 'Layout', 'Layout Design', 'İş Təhlükəsizliyi', 'Hydraulic Systems', 'Pneumatics', 'Maintenance'],
            'Marketinq, Reklam və PR' => ['SEO', 'Google Ads', 'Meta Ads', 'Google Analytics', 'Content Marketing', 'SMM', 'Email Marketing', 'Copywriting', 'PR', 'Media Planlaşdırma', 'Branding', 'Canva', 'Adobe Premiere', 'TikTok Ads', 'LinkedIn Ads', 'Kampaniya İdarəetməsi', 'A/B Testing', 'Market Research', 'Analytics', 'Influencer Marketing', 'Landing Page', 'CRM', 'KPI', 'Lead Generation', 'Event Management'],
            'Turizm, otellər, restoranlar' => ['Resepsiya', 'Otel İdarəetməsi', 'Restoran Xidməti', 'Aşpazlıq', 'Barista', 'Sommelier', 'Rezervasiya', 'Guest Relations', 'Housekeeping', 'Food Safety', 'HACCP', 'Turkmenistana', 'Barmen', 'Ofisiant', 'Tur Bələdçiliyi', 'Booking Systems', 'Travel Planning', 'Event Catering', 'Menu Design', 'Inventory', 'POS', 'Müştəri Qayğısı', 'İngilis Dili', 'Multitasking', 'Housekeeping'],
            'Satınalma və təchizat' => ['Satınalma', 'Təchizat Zənciri', 'Vendor Management', 'Negotiation', 'Müqavilə İdarəetməsi', 'Tender', 'Procurement Software', 'Anbar', 'İnventarizasiya', 'Cost Analysis', 'İdxal', 'Logistika', 'Büdcə Nəzarəti', 'Supplier Audit', 'Sifariş İdarəetməsi', 'SAP MM', 'Excel', 'Market Analyzi', 'İnkoTerm', 'Shipping', 'Quality Control', 'KPI', 'Reporting', 'Forecasting', 'E-procurement'],
        ];

        $parents = Category::whereNull('parent_id')->get();
        $created = 0;

        foreach ($parents as $parent) {
            $skills = $domain[$parent->name] ?? ($domain['Müxtəlif'] ?? []);
            if (empty($skills)) {
                continue;
            }

            // Ana kateqoriya + bütün alt kateqoriyalar
            $categories = collect([$parent])->merge($parent->children ?? Category::where('parent_id', $parent->id)->get());

            foreach ($categories as $cat) {
                foreach (array_values($skills) as $i => $skill) {
                    Skill::updateOrCreate(
                        ['slug' => Str::slug($skill).'-'.$cat->id],
                        [
                            'category_id' => $cat->id,
                            'name' => ['az' => $skill],
                            'order' => $i,
                            'is_active' => true,
                        ]
                    );
                    $created++;
                }
            }
        }

        $total = Skill::count();
        $this->command?->info("SkillSeeder: {$total} bacarıq (kateqoriya üzrə 20-30).");
    }
}
