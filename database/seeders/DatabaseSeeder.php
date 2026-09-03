<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Application\Models\Application;
use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\WorkplaceType;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@jobing.com'],
            [
                'name' => 'Jobing Admin',
                'password' => Hash::make('password'),
                'user_type' => 'admin',
                'is_admin' => true,
            ]
        );

        // 2. Categories & Hierarchical Subcategories (Multilingual: AZ, EN, TR, RU)
        $categoriesStructure = [
            [
                'name' => [
                    'az' => 'Proqramlaşdırma & IT',
                    'en' => 'Software & IT',
                    'tr' => 'Yazılım & Bilişim',
                    'ru' => 'Программирование & IT',
                ],
                'slug' => 'yazilim-bilisim',
                'icon' => 'fa-laptop-code',
                'description' => [
                    'az' => 'Backend, Frontend, Full Stack, Mobil, DevOps və Süni İntellekt vakansiyaları.',
                    'en' => 'Backend, Frontend, Full Stack, Mobile, DevOps and AI positions.',
                    'tr' => 'Backend, Frontend, Full Stack, Mobil, DevOps ve Yapay Zekâ pozisyonları.',
                    'ru' => 'Backend, Frontend, Full Stack, Mobile, DevOps и AI вакансии.',
                ],
                'children' => [
                    [
                        'name' => [
                            'az' => 'Backend Proqramlaşdırma (PHP / Laravel / Go / Node)',
                            'en' => 'Backend Development (PHP / Laravel / Go / Node)',
                            'tr' => 'Backend Geliştirme (PHP / Laravel / Go / Node)',
                            'ru' => 'Backend Разработка (PHP / Laravel / Go / Node)',
                        ],
                        'slug' => 'backend-gelistirme',
                        'description' => [
                            'az' => 'Server tərəfli arxitektura, mikroservislər və API sistemləri.',
                            'en' => 'Server-side architecture, microservices and API development.',
                            'tr' => 'Sunucu taraflı mimari, mikroservisler ve API geliştirme.',
                            'ru' => 'Серверная архитектура, микросервисы и API разработка.',
                        ],
                    ],
                    [
                        'name' => [
                            'az' => 'Frontend Proqramlaşdırma (Vue / React / Alpine.js)',
                            'en' => 'Frontend Development (Vue / React / Alpine.js)',
                            'tr' => 'Frontend Geliştirme (Vue / React / Alpine.js)',
                            'ru' => 'Frontend Разработка (Vue / React / Alpine.js)',
                        ],
                        'slug' => 'frontend-gelistirme',
                        'description' => [
                            'az' => 'İstifadəçi interfeysi və müasir JavaScript freymvorkləri.',
                            'en' => 'User interfaces and modern JavaScript frameworks.',
                            'tr' => 'Kullanıcı arayüzü ve modern JavaScript frameworkleri.',
                            'ru' => 'Пользовательский интерфейс и современные JavaScript фреймворки.',
                        ],
                    ],
                    [
                        'name' => [
                            'az' => 'Full Stack Veb Proqramlaşdırma',
                            'en' => 'Full Stack Web Development',
                            'tr' => 'Full Stack Web Geliştirme',
                            'ru' => 'Full Stack Веб Разработка',
                        ],
                        'slug' => 'full-stack-web-gelistirme',
                        'description' => [
                            'az' => 'Ucdan-uca veb tətbiqləri arxitekturası.',
                            'en' => 'End-to-end web applications architecture.',
                            'tr' => 'Uçtan uca web uygulamaları mimarisi.',
                            'ru' => 'Комплексная архитектура веб-приложений.',
                        ],
                    ],
                    [
                        'name' => [
                            'az' => 'DevOps & Bulud (Cloud) İnfrastrukturu',
                            'en' => 'DevOps & Cloud Platform',
                            'tr' => 'DevOps & Cloud Platform',
                            'ru' => 'DevOps & Облачные Платформы',
                        ],
                        'slug' => 'devops-cloud-platform',
                        'description' => [
                            'az' => 'Kubernetes, Docker, CI/CD və bulud infrastrukturu.',
                            'en' => 'Kubernetes, Docker, CI/CD and cloud infrastructure.',
                            'tr' => 'Kubernetes, Docker, CI/CD ve bulut altyapısı.',
                            'ru' => 'Kubernetes, Docker, CI/CD и облачная инфраструктура.',
                        ],
                    ],
                    [
                        'name' => [
                            'az' => 'Mobil Tətbiqlər (iOS / Android / Flutter)',
                            'en' => 'Mobile App Development (iOS / Android / Flutter)',
                            'tr' => 'Mobil Uygulama (iOS / Android / Flutter)',
                            'ru' => 'Мобильные Приложения (iOS / Android / Flutter)',
                        ],
                        'slug' => 'mobil-uygulama-gelistirme',
                        'description' => [
                            'az' => 'Mobil platformalar üçün native və hibrid tətbiqlər.',
                            'en' => 'Native and hybrid apps for mobile platforms.',
                            'tr' => 'Mobil platformlar için native ve hibrit uygulama geliştirme.',
                            'ru' => 'Нативные и гибридные приложения для мобильных платформ.',
                        ],
                    ],
                ]
            ],
            [
                'name' => [
                    'az' => 'Dizayn & Kreativ',
                    'en' => 'Design & Creative',
                    'tr' => 'Tasarım & Kreatif',
                    'ru' => 'Дизайн & Креатив',
                ],
                'slug' => 'tasarim-kreatif',
                'icon' => 'fa-paint-brush',
                'description' => [
                    'az' => 'UI/UX Dizayn, Qrafik Dizayn, 3D Modelləşdirmə və Motion.',
                    'en' => 'UI/UX Design, Graphic Design, 3D Modeling and Motion.',
                    'tr' => 'UI/UX Tasarım, Grafik Tasarım, 3D Modelleme ve Hareketli Grafik.',
                    'ru' => 'UI/UX Дизайн, Графический Дизайн, 3D Моделирование.',
                ],
                'children' => [
                    [
                        'name' => [
                            'az' => 'UI/UX Məhsul Dizaynı',
                            'en' => 'UI/UX Product Design',
                            'tr' => 'UI/UX Ürün Tasarımı',
                            'ru' => 'UI/UX Дизайн Продукта',
                        ],
                        'slug' => 'ui-ux-urun-tasarimi',
                        'description' => [
                            'az' => 'İstifadəçi təcrübəsi və dizayn sistemləri.',
                            'en' => 'User experience and design systems.',
                            'tr' => 'Kullanıcı arayüzü, deneyimi ve tasarım sistemleri.',
                            'ru' => 'Пользовательский интерфейс и дизайн-системы.',
                        ],
                    ],
                    [
                        'name' => [
                            'az' => '3D Sənət & Oyun Vizualizasiyası',
                            'en' => '3D Art & Game Visualization',
                            'tr' => '3D Sanat & Oyun Görselleştirme',
                            'ru' => '3D Арт & Игровая Визуализация',
                        ],
                        'slug' => '3d-sanat-oyun-gorsellestirme',
                        'description' => [
                            'az' => 'Oyun içi 3D modellər, VFX və animasiyalar.',
                            'en' => 'In-game 3D modeling, VFX and animation.',
                            'tr' => 'Oyun içi 3D modelleme, VFX ve animasyon.',
                            'ru' => 'Игровое 3D моделирование, VFX и анимация.',
                        ],
                    ],
                ]
            ],
            [
                'name' => [
                    'az' => 'Data & Süni İntellekt',
                    'en' => 'Data & AI',
                    'tr' => 'Veri & Yapay Zekâ',
                    'ru' => 'Данные & Искусственный Интеллект',
                ],
                'slug' => 'veri-yapay-zeka',
                'icon' => 'fa-database',
                'description' => [
                    'az' => 'Data Science, Machine Learning, Deep Learning və Data Analitika.',
                    'en' => 'Data Science, Machine Learning, Deep Learning and Analytics.',
                    'tr' => 'Data Scientist, Data Engineer, Machine Learning ve Analitik pozisyonları.',
                    'ru' => 'Data Science, Machine Learning, Deep Learning и Аналитика.',
                ],
                'children' => [
                    [
                        'name' => [
                            'az' => 'Süni İntellekt & Maşın Öyrənməsi (ML / AI)',
                            'en' => 'Artificial Intelligence & Machine Learning (ML / AI)',
                            'tr' => 'Yapay Zekâ & Makine Öğrenimi (ML / AI)',
                            'ru' => 'Искусственный Интеллект & Машинное Обучение',
                        ],
                        'slug' => 'yapay-zeka-makine-ogrenimi',
                        'description' => [
                            'az' => 'Model inkişafı, LLM və dərin öyrənmə alqoritmləri.',
                            'en' => 'Model development, LLMs and deep learning.',
                            'tr' => 'Model geliştirme, LLM ve derin öğrenme.',
                            'ru' => 'Разработка моделей, LLM и глубокое обучение.',
                        ],
                    ],
                ]
            ],
            [
                'name' => [
                    'az' => 'Məhsul & Layihə İdarəetməsi',
                    'en' => 'Product & Project Management',
                    'tr' => 'Ürün & Proje Yönetimi',
                    'ru' => 'Управление Продуктами & Проектами',
                ],
                'slug' => 'urun-proje-yonetimi',
                'icon' => 'fa-th-large',
                'description' => [
                    'az' => 'Product Manager, Scrum Master və Agile liderləri.',
                    'en' => 'Product Managers, Scrum Masters and Agile leaders.',
                    'tr' => 'Product Owner, Scrum Master, Proje Yöneticisi ve Agile liderleri.',
                    'ru' => 'Product Managers, Scrum Masters и Agile лидеры.',
                ],
                'children' => [
                    [
                        'name' => [
                            'az' => 'Məhsul İdarəetməsi (Product Manager)',
                            'en' => 'Product Management (Product Manager / Owner)',
                            'tr' => 'Ürün Yönetimi (Product Manager / Owner)',
                            'ru' => 'Управление Продуктом (Product Manager)',
                        ],
                        'slug' => 'urun-yonetimi-product-manager',
                        'description' => [
                            'az' => 'Məhsul strategiyası və yol xəritəsi idarəetməsi.',
                            'en' => 'Product roadmap and strategy management.',
                            'tr' => 'Ürün yol haritası ve strateji yönetimi.',
                            'ru' => 'Управление стратегией и дорожной картой продукта.',
                        ],
                    ],
                ]
            ],
            [
                'name' => [
                    'az' => 'Marketinq & Böyümə',
                    'en' => 'Marketing & Growth',
                    'tr' => 'Pazarlama & Büyüme',
                    'ru' => 'Маркетинг & Рост (Growth)',
                ],
                'slug' => 'pazarlama-buyume',
                'icon' => 'fa-chart-line',
                'description' => [
                    'az' => 'Growth Marketing, Rəqəmsal Marketinq, SEO və Performans.',
                    'en' => 'Growth Hacking, Digital Marketing, SEO, Performance Marketing.',
                    'tr' => 'Growth Hacking, Dijital Pazarlama, SEO, Performans Pazarlaması.',
                    'ru' => 'Growth Marketing, Цифровой Маркетинг, SEO, Таргетинг.',
                ],
                'children' => [
                    [
                        'name' => [
                            'az' => 'Böyümə & Performans Marketinqi',
                            'en' => 'Growth & Performance Marketing',
                            'tr' => 'Büyüme & Performans Pazarlaması (Growth)',
                            'ru' => 'Growth & Performance Маркетинг',
                        ],
                        'slug' => 'buyume-performans-pazarlamasi',
                        'description' => [
                            'az' => 'Rəqəmsal reklam kanalları və konversiya optimizasiyası.',
                            'en' => 'Digital ad channels, CAC/LTV optimization.',
                            'tr' => 'Dijital reklam kanalları, CAC/LTV optimizasyonu.',
                            'ru' => 'Каналы рекламы и оптимизация конверсий.',
                        ],
                    ],
                ]
            ],
        ];

        $categories = [];
        foreach ($categoriesStructure as $catData) {
            $children = $catData['children'] ?? [];
            unset($catData['children']);

            $parent = Category::firstOrCreate(['slug' => $catData['slug']], $catData);
            $categories[$catData['slug']] = $parent;

            foreach ($children as $childData) {
                $childData['parent_id'] = $parent->id;
                $childData['icon'] = $childData['icon'] ?? $parent->icon;
                $child = Category::firstOrCreate(['slug' => $childData['slug']], $childData);
                $categories[$childData['slug']] = $child;
            }
        }

        // 3. Job Attributes (4 Languages: AZ, TR, EN, RU)
        $jobTypesData = [
            [
                'slug' => 'tam-zamanli',
                'name' => [
                    'az' => 'Tam Ştat',
                    'tr' => 'Tam Zamanlı',
                    'en' => 'Full-time',
                    'ru' => 'Полная занятость',
                ],
                'order' => 1,
            ],
            [
                'slug' => 'yari-zamanli',
                'name' => [
                    'az' => 'Yarım Ştat',
                    'tr' => 'Yarı Zamanlı',
                    'en' => 'Part-time',
                    'ru' => 'Частичная занятость',
                ],
                'order' => 2,
            ],
            [
                'slug' => 'sozlesmeli',
                'name' => [
                    'az' => 'Müqavilə əsasında',
                    'tr' => 'Sözleşmeli / Proje',
                    'en' => 'Contract / Project',
                    'ru' => 'Контракт / Проект',
                ],
                'order' => 3,
            ],
            [
                'slug' => 'staj',
                'name' => [
                    'az' => 'Təcrübəçi (Intern)',
                    'tr' => 'Staj (Internship)',
                    'en' => 'Internship',
                    'ru' => 'Стажировка',
                ],
                'order' => 4,
            ],
            [
                'slug' => 'freelance',
                'name' => [
                    'az' => 'Sərbəst (Freelance)',
                    'tr' => 'Freelance',
                    'en' => 'Freelance',
                    'ru' => 'Фриланс',
                ],
                'order' => 5,
            ],
        ];

        $jobTypes = [];
        foreach ($jobTypesData as $jt) {
            $jobTypes[$jt['slug']] = JobType::firstOrCreate(['slug' => $jt['slug']], $jt);
        }

        $workplaceTypesData = [
            [
                'slug' => 'uzaktan',
                'name' => [
                    'az' => 'Məsafədən (Uzaktan)',
                    'tr' => 'Uzaktan (Remote)',
                    'en' => 'Remote',
                    'ru' => 'Удаленно',
                ],
                'icon' => 'fa-laptop',
                'order' => 1,
            ],
            [
                'slug' => 'hibrit',
                'name' => [
                    'az' => 'Hibrid',
                    'tr' => 'Hibrit',
                    'en' => 'Hybrid',
                    'ru' => 'Гибридный',
                ],
                'icon' => 'fa-building-user',
                'order' => 2,
            ],
            [
                'slug' => 'ofiste',
                'name' => [
                    'az' => 'Ofis daxili',
                    'tr' => 'Ofiste (On-site)',
                    'en' => 'On-site',
                    'ru' => 'В офисе',
                ],
                'icon' => 'fa-building',
                'order' => 3,
            ],
        ];

        $workplaceTypes = [];
        foreach ($workplaceTypesData as $wt) {
            $workplaceTypes[$wt['slug']] = WorkplaceType::firstOrCreate(['slug' => $wt['slug']], $wt);
        }

        $experienceLevelsData = [
            [
                'slug' => 'junior',
                'name' => [
                    'az' => 'Başlanğıc (Junior)',
                    'tr' => 'Başlangıç (Junior)',
                    'en' => 'Entry / Junior',
                    'ru' => 'Начальный (Junior)',
                ],
                'order' => 1,
            ],
            [
                'slug' => 'mid',
                'name' => [
                    'az' => 'Orta Səviyyə (Mid)',
                    'tr' => 'Orta Seviye (Mid)',
                    'en' => 'Mid-Level',
                    'ru' => 'Средний (Mid)',
                ],
                'order' => 2,
            ],
            [
                'slug' => 'senior',
                'name' => [
                    'az' => 'Yüksək / Baş (Senior)',
                    'tr' => 'Kıdemli (Senior)',
                    'en' => 'Senior',
                    'ru' => 'Старший (Senior)',
                ],
                'order' => 3,
            ],
            [
                'slug' => 'lead',
                'name' => [
                    'az' => 'Rəhbər / Menecer (Lead)',
                    'tr' => 'Yönetici / Lead',
                    'en' => 'Lead / Manager',
                    'ru' => 'Руководитель (Lead)',
                ],
                'order' => 4,
            ],
        ];

        $experienceLevels = [];
        foreach ($experienceLevelsData as $el) {
            $experienceLevels[$el['slug']] = ExperienceLevel::firstOrCreate(['slug' => $el['slug']], $el);
        }

        // 4. Companies
        $companiesData = [
            [
                'name' => 'FoxSoft Teknoloji',
                'slug' => 'foxsoft-teknoloji',
                'logo' => null,
                'website' => 'https://foxsoft.io',
                'email' => 'careers@foxsoft.io',
                'phone' => '+90 212 555 0101',
                'location' => 'İstanbul / Maslak & Remote',
                'about' => 'FoxSoft, yeni nesil SaaS ürünleri ve yapay zekâ destekli otomasyon sistemleri geliştiren lider bir yazılım şirketidir.',
                'is_verified' => true,
            ],
            [
                'name' => 'Trendyol Tech',
                'slug' => 'trendyol-tech',
                'logo' => null,
                'website' => 'https://trendyol.com',
                'email' => 'tech-jobs@trendyol.com',
                'phone' => '+90 212 331 0200',
                'location' => 'İstanbul / Şişli',
                'about' => 'Türkiye’nin ve bölgenin en büyük e-ticaret ekosistemini milyonlarca mikroservisle yöneten mühendislik ekibi.',
                'is_verified' => true,
            ],
            [
                'name' => 'Insider Growth',
                'slug' => 'insider-growth',
                'logo' => null,
                'website' => 'https://useinsider.com',
                'email' => 'talent@useinsider.com',
                'phone' => '+90 212 288 3400',
                'location' => 'İstanbul / Levent (Hibrit)',
                'about' => 'Yapay zekâ tabanlı çok kanallı müşteri deneyimi ve kişiselleştirme platformu sunan global bir teknoloji şirketi.',
                'is_verified' => true,
            ],
            [
                'name' => 'Papara FinTech',
                'slug' => 'papara-fintech',
                'logo' => null,
                'website' => 'https://papara.com',
                'email' => 'hr@papara.com',
                'phone' => '+90 850 340 0340',
                'location' => 'İstanbul / Üsküdar',
                'about' => 'Finansal özgürlük ve yenilikçi ödeme çözümleri sunan Türkiye’nin öncü FinTech şirketi.',
                'is_verified' => true,
            ],
            [
                'name' => 'Peak Games',
                'slug' => 'peak-games',
                'logo' => null,
                'website' => 'https://peak.com',
                'email' => 'jobs@peak.com',
                'phone' => '+90 212 400 5000',
                'location' => 'İstanbul / Bebek',
                'about' => 'Dünya çapında yüz milyonlarca oyuncuya ulaşan bulmaca ve mobil oyun stüdyosu.',
                'is_verified' => true,
            ],
            [
                'name' => 'Getir Hub',
                'slug' => 'getir-hub',
                'logo' => null,
                'website' => 'https://getir.com',
                'email' => 'careers@getir.com',
                'phone' => '+90 212 705 9900',
                'location' => 'İstanbul / Etiler',
                'about' => 'Dakikalar içinde teslimat modelinin öncüsü hızlı teslimat teknolojileri.',
                'is_verified' => true,
            ],
        ];

        $companies = [];
        foreach ($companiesData as $compData) {
            $companies[$compData['slug']] = Company::firstOrCreate(['slug' => $compData['slug']], $compData);
        }

        // 4. Job Listings
        $jobsData = [
            [
                'company_slug' => 'foxsoft-teknoloji',
                'category_slug' => 'backend-gelistirme',
                'title' => 'Senior Laravel & Vue.js Developer',
                'slug' => 'senior-laravel-vuejs-developer-fx1',
                'job_type' => 'Tam Zamanlı',
                'workplace_type' => 'Uzaktan',
                'experience_level' => 'Kıdemli (Senior)',
                'location' => 'Uzaktan / Tüm Türkiye',
                'salary_min' => 95000,
                'salary_max' => 140000,
                'currency' => 'TRY',
                'description' => '<p>FoxSoft bünyesinde geliştirdiğimiz global SaaS çözümlerinde yer alacak, modern mimari prensiplerine (DDD, Clean Architecture) hâkim <strong>Senior Laravel Geliştirici</strong> arayışımız bulunmaktadır.</p><p>Uluslararası müşterilere hitap eden servislerimizin performansını artıracak ve yeni nesil modülleri hayata geçireceksiniz.</p>',
                'requirements' => '<ul><li>En az 5 yıl Laravel ve PHP (8.2+) tecrübesi</li><li>Vue.js 3 / Inertia.js veya Livewire deneyimi</li><li>PostgreSQL, Redis, RabbitMQ tecrübesi</li><li>Docker, CI/CD süreçleri ve birim test yazma alışkanlığı</li><li>Yüksek erişilebilirlik ve mikroservis mimarisine aşinalık</li></ul>',
                'benefits' => '<ul><li>%100 Uzaktan Çalışma Özgürlüğü</li><li>Yemek ve İnternet Desteği</li><li>Özel Sağlık Sigortası (Tam Kapsamlı)</li><li>Yıllık Eğitim & Konferans Bütçesi</li><li>En son model MacBook Pro ve ekipman desteği</li></ul>',
                'skills' => ['Laravel', 'PHP', 'Vue.js', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS'],
                'is_featured' => true,
                'is_active' => true,
                'deadline' => now()->addDays(30),
                'views_count' => 342,
            ],
            [
                'company_slug' => 'foxsoft-teknoloji',
                'category_slug' => 'full-stack-web-gelistirme',
                'title' => 'Mid-Level Full Stack PHP & Alpine.js Geliştirici',
                'slug' => 'mid-level-full-stack-php-alpinejs-fx2',
                'job_type' => 'Tam Zamanlı',
                'workplace_type' => 'Hibrit',
                'experience_level' => 'Orta Seviye (Mid)',
                'location' => 'İstanbul / Maslak',
                'salary_min' => 65000,
                'salary_max' => 90000,
                'currency' => 'TRY',
                'description' => '<p>Müşteri yönetim portallarımızın ve iç idari panellerimizin gelişiminde rol alacak Full Stack geliştirici arıyoruz.</p>',
                'requirements' => '<ul><li>En az 2-3 yıl Laravel ekosisteminde deneyim</li><li>Alpine.js, Tailwind CSS ve Blade konularında yetkinlik</li><li>RESTful API tasarımı ve entegrasyonu</li><li>Git ve versiyon kontrol sistemlerine hâkimiyet</li></ul>',
                'benefits' => '<ul><li>Hibrit çalışma modeli (Haftada 2 gün ofis)</li><li>Özel Sağlık Sigortası</li><li>Yemek kartı + Yol ücreti</li><li>Aylık kitap & eğitim üyeliği</li></ul>',
                'skills' => ['Laravel', 'Alpine.js', 'Filament', 'Tailwind CSS', 'Livewire'],
                'is_featured' => true,
                'is_active' => true,
                'deadline' => now()->addDays(20),
                'views_count' => 198,
            ],
            [
                'company_slug' => 'trendyol-tech',
                'category_slug' => 'devops-cloud-platform',
                'title' => 'DevOps & Cloud Platform Engineer (Kubernetes / AWS)',
                'slug' => 'devops-cloud-platform-engineer-ty1',
                'job_type' => 'Tam Zamanlı',
                'workplace_type' => 'Hibrit',
                'experience_level' => 'Kıdemli (Senior)',
                'location' => 'İstanbul / Şişli',
                'salary_min' => 110000,
                'salary_max' => 165000,
                'currency' => 'TRY',
                'description' => '<p>Trendyol Tech bünyesinde cloud altyapısının orkestrasyonu, ölçeklenmesi ve gözlemlenebilirliği (Observability) üzerine çalışacaksınız.</p>',
                'requirements' => '<ul><li>Geniş ölçekli Kubernetes ve Docker tecrübesi</li><li>Terraform / OpenTofu ile IaC pratikleri</li><li>Prometheus, Grafana, ELK stack ile izleme sistemleri</li><li>AWS / GCP cloud servislerinde derin bilgi</li></ul>',
                'benefits' => '<ul><li>Kapsamlı Yan Hak Paketi</li><li>Hissedarlık / Çalışan Prim Programı</li><li>Yılda 2 defa performans bonusu</li><li>Sınırsız Udemy & O’Reilly erişimi</li></ul>',
                'skills' => ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Prometheus'],
                'is_featured' => true,
                'is_active' => true,
                'deadline' => now()->addDays(45),
                'views_count' => 450,
            ],
            [
                'company_slug' => 'insider-growth',
                'category_slug' => 'ui-ux-urun-tasarimi',
                'title' => 'Lead Product Designer (UI/UX & Design System)',
                'slug' => 'lead-product-designer-ui-ux-in1',
                'job_type' => 'Tam Zamanlı',
                'workplace_type' => 'Uzaktan',
                'experience_level' => 'Yönetici / Lead',
                'location' => 'Uzaktan / Global',
                'salary_min' => 100000,
                'salary_max' => 150000,
                'currency' => 'TRY',
                'description' => '<p>Insider’ın 28 ülkede kullanılan pazarlama otomasyon platformunun tasarım sistemini yönetip, kullanıcı deneyimini mükemmelleştirecek lider tasarımcı arıyoruz.</p>',
                'requirements' => '<ul><li>Figma ve Design Tokens sistemlerinde ileri düzey yetkinlik</li><li>B2B SaaS ürünlerinde kanıtlanmış UX vaka analizleri (Portfolio şarttır)</li><li>Kullanıcı testleri ve veri odaklı tasarım metodolojisi</li><li>İyi seviyede İngilizce</li></ul>',
                'benefits' => '<ul><li>Global çalışma ortamı</li><li>Evden çalışma ergonomi ödeneği</li><li>Özel Sağlık Sigortası</li><li>Yıllık esnek tatil günleri</li></ul>',
                'skills' => ['Figma', 'UI/UX', 'Design System', 'User Research', 'Prototyping'],
                'is_featured' => true,
                'is_active' => true,
                'deadline' => now()->addDays(25),
                'views_count' => 275,
            ],
            [
                'company_slug' => 'papara-fintech',
                'category_slug' => 'yapay-zeka-makine-ogrenimi',
                'title' => 'Senior Machine Learning & Fraud Detection Engineer',
                'slug' => 'senior-ml-fraud-detection-engineer-pp1',
                'job_type' => 'Tam Zamanlı',
                'workplace_type' => 'Hibrit',
                'experience_level' => 'Kıdemli (Senior)',
                'location' => 'İstanbul / Üsküdar',
                'salary_min' => 120000,
                'salary_max' => 170000,
                'currency' => 'TRY',
                'description' => '<p>Papara bünyesinde milyonlarca finansal işlemin anlık risk ve anomali analizini yapan yapay zekâ modellerini geliştireceksiniz.</p>',
                'requirements' => '<ul><li>Python, PyTorch / TensorFlow ve Scikit-learn uzmanlığı</li><li>Real-time feature store ve Kafka tabanlı veri akışları</li><li>Anomaly Detection ve Graph Neural Networks deneyimi</li><li>FinTech regülasyonlarına ve veri gizliliğine hassasiyet</li></ul>',
                'benefits' => '<ul><li>Papara Black Plus avantajları & Çalışan Fonu</li><li>Özel Tamamlayıcı & Tam Sağlık Sigortası</li><li>Eğitim ve Konferans bütçesi</li><li>Fitness / Gym üyeliği</li></ul>',
                'skills' => ['Python', 'Machine Learning', 'PyTorch', 'Kafka', 'SQL', 'PostgreSQL'],
                'is_featured' => true,
                'is_active' => true,
                'deadline' => now()->addDays(35),
                'views_count' => 520,
            ],
            [
                'company_slug' => 'peak-games',
                'category_slug' => '3d-sanat-oyun-gorsellestirme',
                'title' => 'Senior 3D / 2D Game Artist',
                'slug' => 'senior-game-artist-peak1',
                'job_type' => 'Tam Zamanlı',
                'workplace_type' => 'Ofiste',
                'experience_level' => 'Kıdemli (Senior)',
                'location' => 'İstanbul / Bebek',
                'salary_min' => 85000,
                'salary_max' => 130000,
                'currency' => 'TRY',
                'description' => '<p>Peak ailesinin bir parçası olarak oyun içi karakterler, ortamlar, efektler ve arayüz ögeleri tasarlayacaksınız.</p>',
                'requirements' => '<ul><li>Photoshop, Blender / Maya, Unity görsel entegrasyonu</li><li>Mobil oyun sanat tarzlarında güçlü portfolyo</li><li>Animasyon ve görsel efekt (VFX) bilgisi artı puandır</li></ul>',
                'benefits' => '<ul><li>Bebek ofisinde gurme şef yemekleri</li><li>Özel sağlık sigortası</li><li>Yıllık performans primi</li></ul>',
                'skills' => ['Photoshop', 'Blender', 'Unity', '2D Art', '3D Modeling'],
                'is_featured' => false,
                'is_active' => true,
                'deadline' => now()->addDays(15),
                'views_count' => 310,
            ],
            [
                'company_slug' => 'getir-hub',
                'category_slug' => 'urun-yonetimi-product-manager',
                'title' => 'Technical Product Manager (Logistics & Routing)',
                'slug' => 'technical-product-manager-getir1',
                'job_type' => 'Tam Zamanlı',
                'workplace_type' => 'Hibrit',
                'experience_level' => 'Kıdemli (Senior)',
                'location' => 'İstanbul / Etiler',
                'salary_min' => 90000,
                'salary_max' => 135000,
                'currency' => 'TRY',
                'description' => '<p>Mühendislik ve veri bilimi takımlarıyla yakın çalışarak teslimat sürelerini ve algoritma verimliliğini yönetecek TPM arıyoruz.</p>',
                'requirements' => '<ul><li>En az 4 yıl teknik ürün yönetimi tecrübesi</li><li>A/B testleri, analitik araçlar (Mixpanel, Amplitude) ve SQL bilgisi</li><li>Agile / Scrum metodolojilerinde liderlik</li></ul>',
                'benefits' => '<ul><li>Getir indirim kuponları ve yemek kartı</li><li>Özel Sağlık Sigortası</li><li>Hibrit çalışma esnekliği</li></ul>',
                'skills' => ['Product Management', 'Agile', 'SQL', 'A/B Testing', 'Roadmap'],
                'is_featured' => false,
                'is_active' => true,
                'deadline' => now()->addDays(28),
                'views_count' => 165,
            ],
            [
                'company_slug' => 'foxsoft-teknoloji',
                'category_slug' => 'buyume-performans-pazarlamasi',
                'title' => 'Performance & Growth Marketing Specialist',
                'slug' => 'performance-growth-marketing-specialist-fx3',
                'job_type' => 'Tam Zamanlı',
                'workplace_type' => 'Uzaktan',
                'experience_level' => 'Orta Seviye (Mid)',
                'location' => 'Uzaktan / Remote',
                'salary_min' => 50000,
                'salary_max' => 75000,
                'currency' => 'TRY',
                'description' => '<p>SaaS ürünlerimizin küresel pazarlardaki büyümesini hızlandıracak, analitik düşünme yeteneği yüksek pazarlama uzmanı arıyoruz.</p>',
                'requirements' => '<ul><li>Google Ads, Meta Business Manager, LinkedIn Ads yönetimi</li><li>Google Analytics 4, Tag Manager ve dönüşüm takibi</li><li>A/B reklam kreatifleri ve açılış sayfası (landing page) optimizasyonu</li></ul>',
                'benefits' => '<ul><li>%100 Uzaktan Çalışma</li><li>Performansa bağlı çeyreklik prim</li><li>Eğitim ve araç abonelik bütçesi</li></ul>',
                'skills' => ['Google Ads', 'Meta Ads', 'GA4', 'Growth Marketing', 'SEO'],
                'is_featured' => false,
                'is_active' => true,
                'deadline' => now()->addDays(40),
                'views_count' => 140,
            ],
        ];

        $jobTypeMap = [
            'Tam Zamanlı' => $jobTypes['tam-zamanli']->id ?? null,
            'Yarı Zamanlı' => $jobTypes['yari-zamanli']->id ?? null,
            'Sözleşmeli' => $jobTypes['sozlesmeli']->id ?? null,
            'Staj' => $jobTypes['staj']->id ?? null,
            'Freelance' => $jobTypes['freelance']->id ?? null,
        ];

        $workplaceTypeMap = [
            'Uzaktan' => $workplaceTypes['uzaktan']->id ?? null,
            'Hibrit' => $workplaceTypes['hibrit']->id ?? null,
            'Ofiste' => $workplaceTypes['ofiste']->id ?? null,
        ];

        $experienceLevelMap = [
            'Başlangıç (Junior)' => $experienceLevels['junior']->id ?? null,
            'Orta Seviye (Mid)' => $experienceLevels['mid']->id ?? null,
            'Kıdemli (Senior)' => $experienceLevels['senior']->id ?? null,
            'Yönetici / Lead' => $experienceLevels['lead']->id ?? null,
        ];

        foreach ($jobsData as $jobData) {
            $company = $companies[$jobData['company_slug']] ?? null;
            $category = $categories[$jobData['category_slug']] ?? null;

            if ($company && $category) {
                $job = Vacancy::firstOrCreate(
                    ['slug' => $jobData['slug']],
                    [
                        'company_id' => $company->id,
                        'category_id' => $category->id,
                        'job_type_id' => $jobTypeMap[$jobData['job_type']] ?? null,
                        'workplace_type_id' => $workplaceTypeMap[$jobData['workplace_type']] ?? null,
                        'experience_level_id' => $experienceLevelMap[$jobData['experience_level']] ?? null,
                        'title' => $jobData['title'],
                        'job_type' => $jobData['job_type'],
                        'workplace_type' => $jobData['workplace_type'],
                        'experience_level' => $jobData['experience_level'],
                        'location' => $jobData['location'],
                        'salary_min' => $jobData['salary_min'],
                        'salary_max' => $jobData['salary_max'],
                        'currency' => $jobData['currency'],
                        'description' => $jobData['description'],
                        'requirements' => $jobData['requirements'],
                        'benefits' => $jobData['benefits'],
                        'skills' => $jobData['skills'],
                        'is_featured' => $jobData['is_featured'],
                        'is_active' => $jobData['is_active'],
                        'deadline' => $jobData['deadline'],
                        'views_count' => $jobData['views_count'],
                    ]
                );

                // Add 1-2 sample applications
                if ($job->slug === 'senior-laravel-vuejs-developer-fx1') {
                    Application::firstOrCreate(
                        ['applicant_email' => 'can.yilmaz@example.com', 'vacancy_id' => $job->id],
                        [
                            'applicant_name' => 'Can Yılmaz',
                            'applicant_phone' => '+90 532 111 2233',
                            'cover_letter' => 'Merhabalar, 6 yıldır aktif olarak Laravel ekosisteminde kurumsal projeler geliştiriyorum. İlanınızdaki gereksinimler yetkinliklerimle tam örtüşmektedir.',
                            'portfolio_url' => 'https://github.com/canyilmaz-dev',
                            'linkedin_url' => 'https://linkedin.com/in/canyilmaz-dev',
                            'status' => 'Mülakat',
                            'notes' => 'Teknik ön değerlendirme testi başarıyla geçti. Salı günü teknik mülakat planlandı.',
                        ]
                    );

                    Application::firstOrCreate(
                        ['applicant_email' => 'elif.kaya@example.com', 'vacancy_id' => $job->id],
                        [
                            'applicant_name' => 'Elif Kaya',
                            'applicant_phone' => '+90 544 987 6543',
                            'cover_letter' => 'Laravel ve Vue.js ile birçok SaaS projesi tamamladım. Ekibinize değer katmak isterim.',
                            'portfolio_url' => 'https://elifkaya.dev',
                            'linkedin_url' => 'https://linkedin.com/in/elifkayadev',
                            'status' => 'İncelendi',
                            'notes' => 'Portfolyosu incelendi, projeleri temiz kod prensiplerine uygun.',
                        ]
                    );
                }
            }
        }

        $this->call(RandomVacanciesSeeder::class);
    }
}
