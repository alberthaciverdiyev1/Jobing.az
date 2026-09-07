<?php

namespace Database\Seeders;

use App\Modules\Category\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriesData = [
            // 1. Marketinq, Reklam və PR
            [
                'name' => [
                    'az' => 'Marketinq, Reklam və PR',
                    'en' => 'Marketing, Advertising & PR',
                    'tr' => 'Pazarlama, Reklam ve PR',
                    'ru' => 'Маркетинг, Реклама и PR',
                ],
                'slug' => 'marketinq-reklam-pr',
                'icon' => 'fa-bullhorn',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Marketinq meneceri / Rəqəmsal marketoloq',
                            'en' => 'Marketing Manager / Digital Marketer',
                            'tr' => 'Pazarlama Müdürü / Dijital Pazarlamacı',
                            'ru' => 'Маркетинг-менеджер / Digital-маркетолог',
                        ],
                        'slug' => 'marketinq-meneceri-reqemsal-marketoloq',
                    ],
                    [
                        'name' => [
                            'az' => 'PR menecer',
                            'en' => 'PR Manager',
                            'tr' => 'PR Müdürü',
                            'ru' => 'PR-менеджер',
                        ],
                        'slug' => 'pr-menecer',
                    ],
                    [
                        'name' => [
                            'az' => 'Marketinq və PR direktoru (CMO)',
                            'en' => 'Marketing & PR Director (CMO)',
                            'tr' => 'Pazarlama ve PR Direktörü (CMO)',
                            'ru' => 'Директор по маркетингу и PR (CMO)',
                        ],
                        'slug' => 'marketinq-ve-pr-direktoru-cmo',
                    ],
                    [
                        'name' => [
                            'az' => 'Kopirayter, mətn yazarı, redaktor',
                            'en' => 'Copywriter, Content Writer, Editor',
                            'tr' => 'Metin Yazarı, Editör',
                            'ru' => 'Копирайтер, автор текстов, редактор',
                        ],
                        'slug' => 'kopirayter-metn-yazari-redaktor',
                    ],
                    [
                        'name' => [
                            'az' => 'Kontent menecer',
                            'en' => 'Content Manager',
                            'tr' => 'İçerik Yöneticisi',
                            'ru' => 'Контент-менеджер',
                        ],
                        'slug' => 'kontent-menecer',
                    ],
                    [
                        'name' => [
                            'az' => 'Marketinq analitiki',
                            'en' => 'Marketing Analyst',
                            'tr' => 'Pazarlama Analisti',
                            'ru' => 'Маркетинговый аналитик',
                        ],
                        'slug' => 'marketinq-analitiki',
                    ],
                    [
                        'name' => [
                            'az' => 'Art direktor, kreativ direktor',
                            'en' => 'Art Director, Creative Director',
                            'tr' => 'Sanat Yönetmeni, Kreatif Direktör',
                            'ru' => 'Арт-директор, креативный директор',
                        ],
                        'slug' => 'art-direktor-kreativ-direktor',
                    ],
                    [
                        'name' => [
                            'az' => 'SMM menecer / Kontent menecer',
                            'en' => 'SMM Manager / Social Media Specialist',
                            'tr' => 'SMM Yöneticisi / Sosyal Medya Uzmanı',
                            'ru' => 'SMM-менеджер / Специалист по соцсетям',
                        ],
                        'slug' => 'smm-menecer-kontent-menecer',
                    ],
                    [
                        'name' => [
                            'az' => 'Qrafik dizayner',
                            'en' => 'Graphic Designer',
                            'tr' => 'Grafik Tasarımcı',
                            'ru' => 'Графический дизайнер',
                        ],
                        'slug' => 'qrafik-dizayner-marketinq',
                    ],
                ],
            ],

            // 2. Maliyyə və Mühasibatlıq
            [
                'name' => [
                    'az' => 'Maliyyə və Mühasibatlıq',
                    'en' => 'Finance & Accounting',
                    'tr' => 'Finans ve Muhasebe',
                    'ru' => 'Финансы и Бухгалтерия',
                ],
                'slug' => 'maliyye-ve-muhasibatliq',
                'icon' => 'fa-coins',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Kredit mütəxəssisi',
                            'en' => 'Credit Specialist / Loan Officer',
                            'tr' => 'Kredi Uzmanı',
                            'ru' => 'Кредитный специалист',
                        ],
                        'slug' => 'kredit-mutexessisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Auditor',
                            'en' => 'Auditor',
                            'tr' => 'Denetçi / Denetmen',
                            'ru' => 'Аудитор',
                        ],
                        'slug' => 'auditor',
                    ],
                    [
                        'name' => [
                            'az' => 'Mühasib',
                            'en' => 'Accountant',
                            'tr' => 'Muhasebeci',
                            'ru' => 'Бухгалтер',
                        ],
                        'slug' => 'muhasib',
                    ],
                    [
                        'name' => [
                            'az' => 'Maliyyə analitiki / İnvestisiya analitiki',
                            'en' => 'Financial Analyst / Investment Analyst',
                            'tr' => 'Finansal Analist / Yatırım Analisti',
                            'ru' => 'Финансовый аналитик / Инвестиционный аналитик',
                        ],
                        'slug' => 'maliyye-analitiki-investisiya-analitiki',
                    ],
                    [
                        'name' => [
                            'az' => 'Kassir',
                            'en' => 'Cashier',
                            'tr' => 'Kasiyer',
                            'ru' => 'Кассир',
                        ],
                        'slug' => 'kassir-maliyye',
                    ],
                    [
                        'name' => [
                            'az' => 'İqtisadçı',
                            'en' => 'Economist',
                            'tr' => 'İktisatçı / Ekonomist',
                            'ru' => 'Экономист',
                        ],
                        'slug' => 'iqtisadci',
                    ],
                    [
                        'name' => [
                            'az' => 'Maliyyə meneceri',
                            'en' => 'Finance Manager',
                            'tr' => 'Finans Müdürü',
                            'ru' => 'Финансовый менеджер',
                        ],
                        'slug' => 'maliyye-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Komplayens meneceri',
                            'en' => 'Compliance Manager',
                            'tr' => 'Uyum (Compliance) Müdürü',
                            'ru' => 'Комплаенс-менеджер',
                        ],
                        'slug' => 'komplayens-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Broker',
                            'en' => 'Broker',
                            'tr' => 'Broker',
                            'ru' => 'Брокер',
                        ],
                        'slug' => 'broker',
                    ],
                    [
                        'name' => [
                            'az' => 'Borc yığımı mütəxəssisi',
                            'en' => 'Debt Collection Specialist',
                            'tr' => 'Tahsilat Uzmanı',
                            'ru' => 'Специалист по взысканию задолженности',
                        ],
                        'slug' => 'borc-yigimi-mutexessisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Maliyyə direktoru (CFO)',
                            'en' => 'Chief Financial Officer (CFO)',
                            'tr' => 'Mali İşler Direktörü (CFO)',
                            'ru' => 'Финансовый директор (CFO)',
                        ],
                        'slug' => 'maliyye-direktoru-cfo',
                    ],
                    [
                        'name' => [
                            'az' => 'Digər',
                            'en' => 'Other Finance Roles',
                            'tr' => 'Diğer Finans Rolleri',
                            'ru' => 'Другое в финансах',
                        ],
                        'slug' => 'diger-maliyye',
                    ],
                ],
            ],

            // 3. İnformasiya texnologiyaları
            [
                'name' => [
                    'az' => 'İnformasiya texnologiyaları',
                    'en' => 'Information Technology (IT)',
                    'tr' => 'Bilişim Teknolojileri (IT)',
                    'ru' => 'Информационные технологии (IT)',
                ],
                'slug' => 'informasiya-texnologiyalari',
                'icon' => 'fa-laptop-code',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Proqramlaşdırma',
                            'en' => 'Software Development & Programming',
                            'tr' => 'Yazılım Geliştirme & Programlama',
                            'ru' => 'Программирование и разработка ПО',
                        ],
                        'slug' => 'proqramlasdirma',
                    ],
                    [
                        'name' => [
                            'az' => 'Sistem idarəetməsi',
                            'en' => 'System Administration & DevOps',
                            'tr' => 'Sistem Yönetimi & DevOps',
                            'ru' => 'Системное администрирование & DevOps',
                        ],
                        'slug' => 'sistem-idareetmesi',
                    ],
                    [
                        'name' => [
                            'az' => 'Məlumat bazasının idarə edilməsi və inkişafı',
                            'en' => 'Database Administration & Development (DBA)',
                            'tr' => 'Veritabanı Yönetimi ve Geliştirme (DBA)',
                            'ru' => 'Администрирование и разработка баз данных',
                        ],
                        'slug' => 'melumat-bazasinin-idare-edilmesi-ve-inkisafi',
                    ],
                    [
                        'name' => [
                            'az' => 'İT mütəxəssisi / məsləhətçi',
                            'en' => 'IT Specialist / IT Consultant',
                            'tr' => 'IT Uzmanı / BT Danışmanı',
                            'ru' => 'IT-специалист / IT-консультант',
                        ],
                        'slug' => 'it-mutexessisi-meslehetci',
                    ],
                    [
                        'name' => [
                            'az' => 'İT layihələrin idarə edilməsi',
                            'en' => 'IT Project Management / Scrum Master',
                            'tr' => 'BT Proje Yönetimi / Scrum Master',
                            'ru' => 'Управление IT-проектами / Scrum Master',
                        ],
                        'slug' => 'it-layihelerin-idare-edilmesi',
                    ],
                    [
                        'name' => [
                            'az' => 'Texniki avadanlıq mütəxəssisi',
                            'en' => 'Hardware & Technical Support Specialist',
                            'tr' => 'Donanım ve Teknik Destek Uzmanı',
                            'ru' => 'Специалист по аппаратному обеспечению и техподдержке',
                        ],
                        'slug' => 'texniki-avadanliq-mutexessisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Digər',
                            'en' => 'Other IT Roles',
                            'tr' => 'Diğer BT Rolleri',
                            'ru' => 'Другое в IT',
                        ],
                        'slug' => 'diger-it',
                    ],
                ],
            ],

            // 4. İnzibati heyət
            [
                'name' => [
                    'az' => 'İnzibati heyət',
                    'en' => 'Administrative Staff & HR',
                    'tr' => 'İdari Kadro ve İK',
                    'ru' => 'Административный персонал и HR',
                ],
                'slug' => 'inzibati-heyet',
                'icon' => 'fa-user-tie',
                'children' => [
                    [
                        'name' => [
                            'az' => 'İnzibati dəstək',
                            'en' => 'Administrative Support',
                            'tr' => 'İdari Destek',
                            'ru' => 'Административная поддержка',
                        ],
                        'slug' => 'inzibati-destek',
                    ],
                    [
                        'name' => [
                            'az' => 'Menecment',
                            'en' => 'Management / Operations',
                            'tr' => 'Yönetim / Operasyon',
                            'ru' => 'Менеджмент / Операции',
                        ],
                        'slug' => 'menecment-inzibati',
                    ],
                    [
                        'name' => [
                            'az' => 'Ofis meneceri',
                            'en' => 'Office Manager',
                            'tr' => 'Ofis Müdürü',
                            'ru' => 'Офис-менеджер',
                        ],
                        'slug' => 'ofis-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Katibə, resepşn, köməkçi',
                            'en' => 'Secretary, Receptionist, Assistant',
                            'tr' => 'Sekreter, Resepsiyonist, Asistan',
                            'ru' => 'Секретарь, ресепшионист, помощник',
                        ],
                        'slug' => 'katibe-resepisn-komekci',
                    ],
                    [
                        'name' => [
                            'az' => 'Heyətin idarəolunması',
                            'en' => 'Human Resources (HR) & Talent Acquisition',
                            'tr' => 'İnsan Kaynakları (İK) ve İşe Alım',
                            'ru' => 'Управление персоналом (HR) и рекрутинг',
                        ],
                        'slug' => 'heyetin-idareolunmasi',
                    ],
                    [
                        'name' => [
                            'az' => 'Administrator',
                            'en' => 'Administrator',
                            'tr' => 'Yönetici / Administrator',
                            'ru' => 'Администратор',
                        ],
                        'slug' => 'administrator-inzibati',
                    ],
                    [
                        'name' => [
                            'az' => 'Tərcüməçi',
                            'en' => 'Translator / Interpreter',
                            'tr' => 'Tercüman / Çevirmen',
                            'ru' => 'Переводчик',
                        ],
                        'slug' => 'tercumeci',
                    ],
                    [
                        'name' => [
                            'az' => 'Digər',
                            'en' => 'Other Administrative Roles',
                            'tr' => 'Diğer İdari Roller',
                            'ru' => 'Другое в административной сфере',
                        ],
                        'slug' => 'diger-inzibati',
                    ],
                ],
            ],

            // 5. Satış və müştəri xidməti
            [
                'name' => [
                    'az' => 'Satış və müştəri xidməti',
                    'en' => 'Sales & Customer Service',
                    'tr' => 'Satış ve Müşteri Hizmetleri',
                    'ru' => 'Продажи и Клиентский сервис',
                ],
                'slug' => 'satis-ve-musteri-xidmeti',
                'icon' => 'fa-headset',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Satış üzrə mütəxəssis',
                            'en' => 'Sales Specialist',
                            'tr' => 'Satış Uzmanı',
                            'ru' => 'Специалист по продажам',
                        ],
                        'slug' => 'satis-uzre-mutexessis',
                    ],
                    [
                        'name' => [
                            'az' => 'Satış meneceri',
                            'en' => 'Sales Manager',
                            'tr' => 'Satış Müdürü / Yöneticisi',
                            'ru' => 'Менеджер по продажам',
                        ],
                        'slug' => 'satis-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Satış məsləhətçisi',
                            'en' => 'Sales Consultant / Associate',
                            'tr' => 'Satış Danışmanı',
                            'ru' => 'Продавец-консультант',
                        ],
                        'slug' => 'satis-meslehetcisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Müştəri meneceri',
                            'en' => 'Account Manager / Customer Relations',
                            'tr' => 'Müşteri Yöneticisi / Portföy Yöneticisi',
                            'ru' => 'Менеджер по работе с клиентами',
                        ],
                        'slug' => 'musteri-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Çağrı mərkəzi operatoru',
                            'en' => 'Call Center Operator',
                            'tr' => 'Çağrı Merkezi Operatörü',
                            'ru' => 'Оператор колл-центра',
                        ],
                        'slug' => 'cagri-merkezi-operatoru',
                    ],
                    [
                        'name' => [
                            'az' => 'Sığorta agenti',
                            'en' => 'Insurance Agent',
                            'tr' => 'Sigorta Temsilcisi / Acentesi',
                            'ru' => 'Страховой агент',
                        ],
                        'slug' => 'sigorta-agenti',
                    ],
                    [
                        'name' => [
                            'az' => 'Daşınmaz əmlak agenti / makler',
                            'en' => 'Real Estate Agent / Realtor',
                            'tr' => 'Gayrimenkul Danışmanı / Emlakçı',
                            'ru' => 'Агент по недвижимости / Риелтор',
                        ],
                        'slug' => 'dasinmaz-emlak-agenti-makler',
                    ],
                    [
                        'name' => [
                            'az' => 'Kassir-operator',
                            'en' => 'Cashier Operator',
                            'tr' => 'Kasiyer Operatörü',
                            'ru' => 'Кассир-оператор',
                        ],
                        'slug' => 'kassir-operator',
                    ],
                    [
                        'name' => [
                            'az' => 'Satış şöbəsinin rəhbəri',
                            'en' => 'Head of Sales',
                            'tr' => 'Satış Departmanı Başkanı',
                            'ru' => 'Руководитель отдела продаж',
                        ],
                        'slug' => 'satis-sobesinin-rehberi',
                    ],
                    [
                        'name' => [
                            'az' => 'Filial rəhbəri / Mağaza rəhbəri',
                            'en' => 'Branch Manager / Store Manager',
                            'tr' => 'Şube Müdürü / Mağaza Müdürü',
                            'ru' => 'Директор филиала / Управляющий магазином',
                        ],
                        'slug' => 'filial-rehberi-magaza-rehberi',
                    ],
                    [
                        'name' => [
                            'az' => 'Kommersiya direktoru (CCO)',
                            'en' => 'Chief Commercial Officer (CCO)',
                            'tr' => 'Ticari Direktör (CCO)',
                            'ru' => 'Коммерческий директор (CCO)',
                        ],
                        'slug' => 'kommersiya-direktoru-cco',
                    ],
                ],
            ],

            // 6. Dizayn
            [
                'name' => [
                    'az' => 'Dizayn',
                    'en' => 'Design & Creative Arts',
                    'tr' => 'Tasarım ve Kreatif Sanatlar',
                    'ru' => 'Дизайн и Искусство',
                ],
                'slug' => 'dizayn',
                'icon' => 'fa-palette',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Veb-dizayn (UI/UX)',
                            'en' => 'Web Design (UI/UX)',
                            'tr' => 'Web Tasarımı (UI/UX)',
                            'ru' => 'Веб-дизайн (UI/UX)',
                        ],
                        'slug' => 'veb-dizayn-ui-ux',
                    ],
                    [
                        'name' => [
                            'az' => 'Memar / İnteryer dizaynı',
                            'en' => 'Architect / Interior Designer',
                            'tr' => 'Mimar / İç Mimar',
                            'ru' => 'Архитектор / Дизайнер интерьера',
                        ],
                        'slug' => 'memar-interyer-dizayni',
                    ],
                    [
                        'name' => [
                            'az' => 'Geyim dizaynı',
                            'en' => 'Fashion & Apparel Designer',
                            'tr' => 'Moda & Giyim Tasarımcısı',
                            'ru' => 'Дизайнер одежды и моды',
                        ],
                        'slug' => 'geyim-dizayni',
                    ],
                    [
                        'name' => [
                            'az' => 'Rəssam / İllüstrator',
                            'en' => 'Artist / Illustrator',
                            'tr' => 'Sanatçı / İllüstratör',
                            'ru' => 'Художник / Иллюстратор',
                        ],
                        'slug' => 'ressam-illustrator',
                    ],
                    [
                        'name' => [
                            'az' => 'Digər',
                            'en' => 'Other Design Roles',
                            'tr' => 'Diğer Tasarım Rolleri',
                            'ru' => 'Другое в дизайне',
                        ],
                        'slug' => 'diger-dizayn',
                    ],
                ],
            ],

            // 7. Hüquqşünaslıq
            [
                'name' => [
                    'az' => 'Hüquqşünaslıq',
                    'en' => 'Legal & Jurisprudence',
                    'tr' => 'Hukuk ve Yargı',
                    'ru' => 'Юриспруденция и Право',
                ],
                'slug' => 'huquqsunasliq',
                'icon' => 'fa-scale-balanced',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Hüquqşünas',
                            'en' => 'Lawyer / Legal Counsel',
                            'tr' => 'Hukuk Müşaviri / Avukat',
                            'ru' => 'Юрист / Юрисконсульт',
                        ],
                        'slug' => 'huquqsunas-legal',
                    ],
                    [
                        'name' => [
                            'az' => 'Vəkil',
                            'en' => 'Attorney / Advocate',
                            'tr' => 'Dava Vekili / Avukat',
                            'ru' => 'Адвокат',
                        ],
                        'slug' => 'vekil-advocate',
                    ],
                    [
                        'name' => [
                            'az' => 'Cinayət hüququ',
                            'en' => 'Criminal Law Specialist',
                            'tr' => 'Ceza Hukuku Uzmanı',
                            'ru' => 'Специалист по уголовному праву',
                        ],
                        'slug' => 'cinayet-huququ-specialist',
                    ],
                    [
                        'name' => [
                            'az' => 'Digər',
                            'en' => 'Other Legal Roles',
                            'tr' => 'Diğer Hukuk Rolleri',
                            'ru' => 'Другое в юриспруденции',
                        ],
                        'slug' => 'diger-huquq',
                    ],
                ],
            ],

            // 8. Təhsil və elm
            [
                'name' => [
                    'az' => 'Təhsil və elm',
                    'en' => 'Education & Science',
                    'tr' => 'Eğitim ve Bilim',
                    'ru' => 'Образование и Наука',
                ],
                'slug' => 'tehsil-ve-elm',
                'icon' => 'fa-graduation-cap',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Məktəb tədrisi',
                            'en' => 'School Teaching (K-12)',
                            'tr' => 'Okul Öğretmenliği',
                            'ru' => 'Школьное преподавание',
                        ],
                        'slug' => 'mekteb-tedrisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Universitet tədrisi',
                            'en' => 'University Teaching & Professorship',
                            'tr' => 'Üniversite Akademik Kadro / Eğitmen',
                            'ru' => 'Преподавание в ВУЗе / Профессура',
                        ],
                        'slug' => 'universitet-tedrisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Repetitor',
                            'en' => 'Tutor / Private Instructor',
                            'tr' => 'Özel Ders Öğretmeni / Rehber',
                            'ru' => 'Репетитор / Частный преподаватель',
                        ],
                        'slug' => 'repetitor',
                    ],
                    [
                        'name' => [
                            'az' => 'Xüsusi təhsil / Təlim',
                            'en' => 'Special Education / Corporate Trainer',
                            'tr' => 'Özel Eğitim / Kurumsal Eğitmen',
                            'ru' => 'Специальное образование / Корпоративный тренер',
                        ],
                        'slug' => 'xususi-tehsil-telim',
                    ],
                    [
                        'name' => [
                            'az' => 'Digər',
                            'en' => 'Other Education Roles',
                            'tr' => 'Diğer Eğitim Rolleri',
                            'ru' => 'Другое в образовании',
                        ],
                        'slug' => 'diger-tehsil',
                    ],
                ],
            ],

            // 9. Kənd təsərrüfatı
            [
                'name' => [
                    'az' => 'Kənd təsərrüfatı',
                    'en' => 'Agriculture & Environment',
                    'tr' => 'Tarım ve Çevre',
                    'ru' => 'Сельское хозяйство и Экология',
                ],
                'slug' => 'kend-teserrufati',
                'icon' => 'fa-seedling',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Aqronom',
                            'en' => 'Agronomist',
                            'tr' => 'Ziraat Mühendisi / Agronom',
                            'ru' => 'Агроном',
                        ],
                        'slug' => 'aqronom',
                    ],
                    [
                        'name' => [
                            'az' => 'Geologiya və ətraf mühit',
                            'en' => 'Geology & Environmental Science',
                            'tr' => 'Jeoloji ve Çevre Bilimi',
                            'ru' => 'Геология и охрана окружающей среды',
                        ],
                        'slug' => 'geologiya-ve-etraf-muhit',
                    ],
                    [
                        'name' => [
                            'az' => 'Texnoloq',
                            'en' => 'Food & Agricultural Technologist',
                            'tr' => 'Gıda & Tarım Teknologu',
                            'ru' => 'Технолог пищевого и сельского хозяйства',
                        ],
                        'slug' => 'texnoloq-kend-teserrufati',
                    ],
                    [
                        'name' => [
                            'az' => 'Bağban',
                            'en' => 'Gardener / Landscaper',
                            'tr' => 'Bahçıvan / Peyzajcı',
                            'ru' => 'Садовник / Озеленитель',
                        ],
                        'slug' => 'bagban',
                    ],
                    [
                        'name' => [
                            'az' => 'Digər',
                            'en' => 'Other Agriculture Roles',
                            'tr' => 'Diğer Tarım Rolleri',
                            'ru' => 'Другое в сельском хозяйстве',
                        ],
                        'slug' => 'diger-kend-teserrufati',
                    ],
                ],
            ],

            // 10. Xidmət Personalı
            [
                'name' => [
                    'az' => 'Xidmət Personalı',
                    'en' => 'Service Personnel & Support',
                    'tr' => 'Hizmet Personeli',
                    'ru' => 'Обслуживающий персонал',
                ],
                'slug' => 'xidmet-personali',
                'icon' => 'fa-hands-helping',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Xadimə',
                            'en' => 'Cleaner / Housekeeper',
                            'tr' => 'Temizlik Görevlisi',
                            'ru' => 'Уборщица / Клинер',
                        ],
                        'slug' => 'xadime-service',
                    ],
                    [
                        'name' => [
                            'az' => 'Dayə',
                            'en' => 'Nanny / Babysitter',
                            'tr' => 'Bakıcı / Dadı',
                            'ru' => 'Няня / Сиделка',
                        ],
                        'slug' => 'daye',
                    ],
                    [
                        'name' => [
                            'az' => 'Fəhlə',
                            'en' => 'General Laborer / Worker',
                            'tr' => 'Vasıfsız İşçi / Beden İşçisi',
                            'ru' => 'Разнорабочий / Грузчик',
                        ],
                        'slug' => 'fehle-worker',
                    ],
                    [
                        'name' => [
                            'az' => 'Mühafizə xidməti',
                            'en' => 'Security Guard / Security Officer',
                            'tr' => 'Güvenlik Görevlisi',
                            'ru' => 'Служба охраны / Охранник',
                        ],
                        'slug' => 'muhafize-xidmeti',
                    ],
                    [
                        'name' => [
                            'az' => 'Kuryer',
                            'en' => 'Courier / Delivery Personnel',
                            'tr' => 'Kurye / Dağıtım Görevlisi',
                            'ru' => 'Курьер / Доставщик',
                        ],
                        'slug' => 'kuryer-service',
                    ],
                    [
                        'name' => [
                            'az' => 'Anbardar',
                            'en' => 'Warehouse Worker / Keeper',
                            'tr' => 'Depo Elemanı / Depocu',
                            'ru' => 'Кладовщик / Работник склада',
                        ],
                        'slug' => 'anbardar-service',
                    ],
                    [
                        'name' => [
                            'az' => 'Çağrı mərkəzi operatoru, müştəri xidmətləri mütəxəssisi',
                            'en' => 'Call Center & Support Specialist',
                            'tr' => 'Çağrı Merkezi ve Destek Uzmanı',
                            'ru' => 'Оператор колл-центра, специалист поддержки',
                        ],
                        'slug' => 'cagri-merkezi-ve-musteri-xidmetleri',
                    ],
                    [
                        'name' => [
                            'az' => 'Digər',
                            'en' => 'Other Service Roles',
                            'tr' => 'Diğer Hizmet Rolleri',
                            'ru' => 'Другой обслуживающий персонал',
                        ],
                        'slug' => 'diger-xidmet',
                    ],
                ],
            ],

            // 11. Tibb və əczaçılıq
            [
                'name' => [
                    'az' => 'Tibb və əczaçılıq',
                    'en' => 'Medicine & Pharmacy',
                    'tr' => 'Tıp ve Eczacılık',
                    'ru' => 'Медицина и Фармацевтика',
                ],
                'slug' => 'tibb-ve-eczaciliq',
                'icon' => 'fa-stethoscope',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Həkim',
                            'en' => 'Doctor / Physician',
                            'tr' => 'Doktor / Hekim',
                            'ru' => 'Врач / Доктор',
                        ],
                        'slug' => 'hekim',
                    ],
                    [
                        'name' => [
                            'az' => 'Tibbi personal (Tibb bacısı / Qardaşı)',
                            'en' => 'Medical Staff (Nurse / Caregiver)',
                            'tr' => 'Sağlık Personeli (Hemşire / Hasta Bakıcı)',
                            'ru' => 'Медицинский персонал (Медсестра / Медбрат)',
                        ],
                        'slug' => 'tibbi-personal',
                    ],
                    [
                        'name' => [
                            'az' => 'Tibbi nümayəndə / Əczaçı',
                            'en' => 'Medical Representative / Pharmacist',
                            'tr' => 'Tıbbi Satış Mümessili / Eczacı',
                            'ru' => 'Медицинский представитель / Фармацевт',
                        ],
                        'slug' => 'tibbi-numayende-eczaci',
                    ],
                    [
                        'name' => [
                            'az' => 'Laborant',
                            'en' => 'Laboratory Assistant / Technician',
                            'tr' => 'Laborant / Laboratuvar Teknikeri',
                            'ru' => 'Лаборант / Техник лаборатории',
                        ],
                        'slug' => 'laborant',
                    ],
                    [
                        'name' => [
                            'az' => 'Baytarlıq həkimi',
                            'en' => 'Veterinarian',
                            'tr' => 'Veteriner Hekim',
                            'ru' => 'Ветеринарный врач',
                        ],
                        'slug' => 'baytarliq-hekimi',
                    ],
                ],
            ],

            // 12. Müxtəlif
            [
                'name' => [
                    'az' => 'Müxtəlif',
                    'en' => 'General & Miscellaneous',
                    'tr' => 'Çeşitli & Genel',
                    'ru' => 'Разное & Общее',
                ],
                'slug' => 'muxtelif',
                'icon' => 'fa-cubes',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Jurnalistika və Media',
                            'en' => 'Journalism & Media',
                            'tr' => 'Gazetecilik ve Medya',
                            'ru' => 'Журналистика и СМИ',
                        ],
                        'slug' => 'jurnalistika-ve-media',
                    ],
                    [
                        'name' => [
                            'az' => 'Tələbələr və Təcrübəçilər üçün',
                            'en' => 'For Students & Interns',
                            'tr' => 'Öğrenciler ve Stajyerler İçin',
                            'ru' => 'Для студентов и стажеров',
                        ],
                        'slug' => 'telebeler-ve-tecrubeciler-ucun',
                    ],
                ],
            ],

            // 13. Turizm, otellər, restoranlar
            [
                'name' => [
                    'az' => 'Turizm, otellər, restoranlar',
                    'en' => 'Tourism, Hotels & Restaurants (HoReCa)',
                    'tr' => 'Turizm, Otelcilik ve Restoran (HoReCa)',
                    'ru' => 'Туризм, Отели и Рестораны (HoReCa)',
                ],
                'slug' => 'turizm-oteller-restoranlar',
                'icon' => 'fa-utensils',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Restoran işi',
                            'en' => 'Restaurant Operations',
                            'tr' => 'Restoran İşletmeciliği',
                            'ru' => 'Ресторанный бизнес',
                        ],
                        'slug' => 'restoran-isi',
                    ],
                    [
                        'name' => [
                            'az' => 'Turizm və mehmanxana işi',
                            'en' => 'Tourism & Hospitality',
                            'tr' => 'Turizm ve Otelcilik',
                            'ru' => 'Туризм и гостиничное дело',
                        ],
                        'slug' => 'turizm-ve-mehmanxana-isi',
                    ],
                    [
                        'name' => [
                            'az' => 'Turizm meneceri',
                            'en' => 'Tourism Manager / Travel Agent',
                            'tr' => 'Turizm Müdürü / Seyahat Danışmanı',
                            'ru' => 'Менеджер по туризму / Турагент',
                        ],
                        'slug' => 'turizm-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Restoran meneceri',
                            'en' => 'Restaurant Manager',
                            'tr' => 'Restoran Müdürü',
                            'ru' => 'Управляющий рестораном',
                        ],
                        'slug' => 'restoran-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Ofisiant, barmen, barista',
                            'en' => 'Waiter, Bartender, Barista',
                            'tr' => 'Garson, Barmen, Barista',
                            'ru' => 'Официант, бармен, бариста',
                        ],
                        'slug' => 'ofisiant-barmen-barista',
                    ],
                    [
                        'name' => [
                            'az' => 'Aşpaz, çörəkçi, şirniyyatçı',
                            'en' => 'Chef, Baker, Pastry Cook',
                            'tr' => 'Aşçı, Fırıncı, Pastacı',
                            'ru' => 'Повар, пекарь, кондитер',
                        ],
                        'slug' => 'aspaz-corekci-sirniyyatci',
                    ],
                    [
                        'name' => [
                            'az' => 'Administrator (Otel / Restoran)',
                            'en' => 'Administrator (Hotel / Restaurant)',
                            'tr' => 'Yönetici (Otel / Restoran)',
                            'ru' => 'Администратор (Отель / Ресторан)',
                        ],
                        'slug' => 'administrator-turizm',
                    ],
                    [
                        'name' => [
                            'az' => 'Hostes',
                            'en' => 'Host / Hostess',
                            'tr' => 'Host / Hostes',
                            'ru' => 'Хостес',
                        ],
                        'slug' => 'hostes',
                    ],
                    [
                        'name' => [
                            'az' => 'Təmizlik üzrə xidmətçi, xadimə (Otel)',
                            'en' => 'Housekeeping & Hotel Cleaner',
                            'tr' => 'Kat Hizmetleri / Temizlikçi (Otel)',
                            'ru' => 'Горничная / Уборщик (Отель)',
                        ],
                        'slug' => 'temizlik-uzre-xidmetci-xadime-otel',
                    ],
                ],
            ],

            // 14. İdman zalları, fitness, gözəllik salonları
            [
                'name' => [
                    'az' => 'İdman zalları, fitness, gözəllik salonları',
                    'en' => 'Fitness, Sports & Beauty Salons',
                    'tr' => 'Spor Salonları, Fitness ve Güzellik Merkezleri',
                    'ru' => 'Спортзалы, Фитнес и Салоны красоты',
                ],
                'slug' => 'idman-zallari-fitness-gozellik-salonlari',
                'icon' => 'fa-dumbbell',
                'children' => [
                    [
                        'name' => [
                            'az' => 'SPA və gözəllik',
                            'en' => 'SPA & Aesthetics',
                            'tr' => 'SPA ve Güzellik',
                            'ru' => 'SPA и косметология',
                        ],
                        'slug' => 'spa-ve-gozellik',
                    ],
                    [
                        'name' => [
                            'az' => 'Saç ustası, bərbər',
                            'en' => 'Hairdresser, Barber',
                            'tr' => 'Kuaför, Berber',
                            'ru' => 'Парикмахер, барбер',
                        ],
                        'slug' => 'sac-ustasi-berber',
                    ],
                    [
                        'name' => [
                            'az' => 'Fitnes məşqçisi, idman zalı təlimatçısı',
                            'en' => 'Fitness Trainer, Gym Instructor',
                            'tr' => 'Fitness Eğitmeni, Spor Antrenörü',
                            'ru' => 'Фитнес-тренер, инструктор тренажерного зала',
                        ],
                        'slug' => 'fitnes-mesqcisi-idman-zali-telimatcisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Dırnaq ustası',
                            'en' => 'Nail Master / Manicurist',
                            'tr' => 'Tırnak Uzmanı / Manikürist',
                            'ru' => 'Мастер маникюра и педикюра',
                        ],
                        'slug' => 'dirnaq-ustasi',
                    ],
                    [
                        'name' => [
                            'az' => 'Masajçı',
                            'en' => 'Massage Therapist',
                            'tr' => 'Masör / Masöz',
                            'ru' => 'Массажист',
                        ],
                        'slug' => 'masajci',
                    ],
                    [
                        'name' => [
                            'az' => 'Kosmetoloq',
                            'en' => 'Cosmetologist / Esthetician',
                            'tr' => 'Güzellik Uzmanı / Kozmetolog',
                            'ru' => 'Косметолог',
                        ],
                        'slug' => 'kosmetoloq',
                    ],
                ],
            ],

            // 15. Nəqliyyat, daşınma və logistika
            [
                'name' => [
                    'az' => 'Nəqliyyat, daşınma və logistika',
                    'en' => 'Transportation, Shipping & Logistics',
                    'tr' => 'Ulaştırma, Taşımacılık ve Lojistik',
                    'ru' => 'Транспорт, Перевозки и Логистика',
                ],
                'slug' => 'neqliyyat-dasinma-ve-logistika',
                'icon' => 'fa-truck-fast',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Sürücü',
                            'en' => 'Driver / Chauffeur',
                            'tr' => 'Şoför / Sürücü',
                            'ru' => 'Водитель / Шофер',
                        ],
                        'slug' => 'surucu-driver',
                    ],
                    [
                        'name' => [
                            'az' => 'Anbardar',
                            'en' => 'Warehouse Supervisor / Storekeeper',
                            'tr' => 'Depo Sorumlusu / Anbar Memuru',
                            'ru' => 'Заведующий складом / Кладовщик',
                        ],
                        'slug' => 'anbardar-logistika',
                    ],
                    [
                        'name' => [
                            'az' => 'Yükvuran fəhlə',
                            'en' => 'Freight Loader / Mover',
                            'tr' => 'Yükleme İşçisi / Taşıyıcı',
                            'ru' => 'Грузчик / Экспедитор',
                        ],
                        'slug' => 'yukvuran-fehle',
                    ],
                    [
                        'name' => [
                            'az' => 'Kuryer',
                            'en' => 'Express Courier',
                            'tr' => 'Hızlı Kurye',
                            'ru' => 'Экспресс-курьер',
                        ],
                        'slug' => 'kuryer-logistika',
                    ],
                    [
                        'name' => [
                            'az' => 'Logistika üzrə mütəxəssis / Menecer',
                            'en' => 'Logistics Specialist / Coordinator',
                            'tr' => 'Lojistik Uzmanı / Koordinatörü',
                            'ru' => 'Специалист по логистике / Логист',
                        ],
                        'slug' => 'logistika-uzre-mutexessis-menecer',
                    ],
                ],
            ],

            // 16. Sənaye, tikinti və istehsalat
            [
                'name' => [
                    'az' => 'Sənaye, tikinti və istehsalat',
                    'en' => 'Industry, Construction & Manufacturing',
                    'tr' => 'Sanayi, İnşaat ve İmalat',
                    'ru' => 'Промышленность, Строительство и Производство',
                ],
                'slug' => 'senaye-tikinti-ve-istehsalat',
                'icon' => 'fa-industry',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Avtomatlaşdırılmış idarəetmə (АСУ ТП)',
                            'en' => 'Industrial Automation & PLC / SCADA',
                            'tr' => 'Endüstriyel Otomasyon & PLC',
                            'ru' => 'Автоматизированное управление (АСУ ТП)',
                        ],
                        'slug' => 'avtomatlasdirilmis-idareetme',
                    ],
                    [
                        'name' => [
                            'az' => 'Tikinti mühəndisliyi və ustalıq',
                            'en' => 'Civil Engineering & Construction',
                            'tr' => 'İnşaat Mühendisliği & Saha',
                            'ru' => 'Строительная инженерия и мастерство',
                        ],
                        'slug' => 'tikinti-muhendisliyi',
                    ],
                    [
                        'name' => [
                            'az' => 'Mühəndis',
                            'en' => 'Engineer (Mechanical / Electrical / Process)',
                            'tr' => 'Mühendis (Makine / Elektrik / Proses)',
                            'ru' => 'Инженер (Механик / Электрик / Технолог)',
                        ],
                        'slug' => 'muhendis-general',
                    ],
                    [
                        'name' => [
                            'az' => 'Avtomexanik, avtoçilingər',
                            'en' => 'Auto Mechanic, Auto Locksmith',
                            'tr' => 'Oto Tamircisi / Oto Mekaniker',
                            'ru' => 'Автомеханик, автослесарь',
                        ],
                        'slug' => 'avtomexanik-avtocilinger',
                    ],
                    [
                        'name' => [
                            'az' => 'Suvaqçı, rəngsaz',
                            'en' => 'Plasterer, Painter',
                            'tr' => 'Sıvacı, Boyacı',
                            'ru' => 'Штукатур, маляр',
                        ],
                        'slug' => 'suvaqci-rengsaz',
                    ],
                    [
                        'name' => [
                            'az' => 'Mexanik',
                            'en' => 'Mechanic / Technician',
                            'tr' => 'Mekanik Teknisyeni',
                            'ru' => 'Механик / Техник',
                        ],
                        'slug' => 'mexanik',
                    ],
                    [
                        'name' => [
                            'az' => 'Montajçı',
                            'en' => 'Assembler / Fitter / Installer',
                            'tr' => 'Montaj Elemanı / Montör',
                            'ru' => 'Монтажник / Сборщик',
                        ],
                        'slug' => 'montajci',
                    ],
                    [
                        'name' => [
                            'az' => 'Qaynaqçı',
                            'en' => 'Welder',
                            'tr' => 'Kaynakçı',
                            'ru' => 'Сварщик',
                        ],
                        'slug' => 'qaynaqci',
                    ],
                    [
                        'name' => [
                            'az' => 'Çilingər, santexnik',
                            'en' => 'Locksmith, Plumber',
                            'tr' => 'Çilingir, Sıhhi Tesisatçı',
                            'ru' => 'Слесарь, сантехник',
                        ],
                        'slug' => 'cilinger-santexnik',
                    ],
                    [
                        'name' => [
                            'az' => 'Elektrik',
                            'en' => 'Electrician',
                            'tr' => 'Elektrikçi / Elektrik Teknisyeni',
                            'ru' => 'Электрик / Электромонтер',
                        ],
                        'slug' => 'elektrik-usta',
                    ],
                    [
                        'name' => [
                            'az' => 'Usta',
                            'en' => 'Master Craftsman / Foreman',
                            'tr' => 'Usta / Formen',
                            'ru' => 'Мастер / Бригадир',
                        ],
                        'slug' => 'usta-senaye',
                    ],
                ],
            ],

            // 17. Satınalma və təchizat
            [
                'name' => [
                    'az' => 'Satınalma və təchizat',
                    'en' => 'Procurement & Supply Chain',
                    'tr' => 'Satınalma ve Tedarik Zinciri',
                    'ru' => 'Закупки и Снабжение',
                ],
                'slug' => 'satinalma-ve-techizat',
                'icon' => 'fa-cart-flatbed',
                'children' => [
                    [
                        'name' => [
                            'az' => 'Tender mütəxəssisi',
                            'en' => 'Tender & Bidding Specialist',
                            'tr' => 'İhale & Teklif Uzmanı',
                            'ru' => 'Специалист по тендерам и торгам',
                        ],
                        'slug' => 'tender-mutexessisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Satınalma meneceri',
                            'en' => 'Procurement Manager',
                            'tr' => 'Satınalma Müdürü',
                            'ru' => 'Менеджер по закупкам',
                        ],
                        'slug' => 'satinalma-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Kateqoriya meneceri',
                            'en' => 'Category Manager',
                            'tr' => 'Kategori Yöneticisi',
                            'ru' => 'Категорийный менеджер',
                        ],
                        'slug' => 'kateqoriya-meneceri',
                    ],
                    [
                        'name' => [
                            'az' => 'Bayer / Alıcı',
                            'en' => 'Buyer / Merchandiser',
                            'tr' => 'Satınalma Uzmanı / Buyer',
                            'ru' => 'Байер / Закупщик',
                        ],
                        'slug' => 'bayer-alici',
                    ],
                    [
                        'name' => [
                            'az' => 'Təchizat mütəxəssisi',
                            'en' => 'Supply Chain Specialist',
                            'tr' => 'Tedarik Uzmanı',
                            'ru' => 'Специалист по снабжению',
                        ],
                        'slug' => 'techizat-mutexessisi',
                    ],
                    [
                        'name' => [
                            'az' => 'İdxal mütəxəssisi',
                            'en' => 'Import / Export Specialist',
                            'tr' => 'İthalat / İhracat Uzmanı',
                            'ru' => 'Специалист по импорту / экспорту',
                        ],
                        'slug' => 'idxal-mutexessisi',
                    ],
                    [
                        'name' => [
                            'az' => 'Satınalma direktoru',
                            'en' => 'Chief Procurement Officer / Director',
                            'tr' => 'Satınalma Direktörü',
                            'ru' => 'Директор по закупкам',
                        ],
                        'slug' => 'satinalma-direktoru',
                    ],
                ],
            ],
        ];

        $validSlugs = [];

        foreach ($categoriesData as $catData) {
            $validSlugs[] = $catData['slug'];
            $children = $catData['children'] ?? [];
            unset($catData['children']);

            $parent = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                [
                    'name' => $catData['name'],
                    'icon' => $catData['icon'] ?? 'fa-briefcase',
                    'parent_id' => null,
                ]
            );

            foreach ($children as $childData) {
                $validSlugs[] = $childData['slug'];
                Category::updateOrCreate(
                    ['slug' => $childData['slug']],
                    [
                        'parent_id' => $parent->id,
                        'name' => $childData['name'],
                        'icon' => $childData['icon'] ?? $parent->icon,
                    ]
                );
            }
        }

        // Cleanup any legacy categories not in the new list
        $legacyCategories = Category::whereNotIn('slug', $validSlugs)->get();
        if ($legacyCategories->isNotEmpty()) {
            $fallbackCategory = Category::where('slug', 'informasiya-texnologiyalari')->first()
                ?? Category::first();

            if ($fallbackCategory) {
                foreach ($legacyCategories as $legacy) {
                    \App\Modules\Vacancy\Models\Vacancy::where('category_id', $legacy->id)->update(['category_id' => $fallbackCategory->id]);
                    \App\Modules\JobSeeker\Models\JobSeeker::where('category_id', $legacy->id)->update(['category_id' => $fallbackCategory->id]);
                    \App\Modules\JobAttribute\Models\Skill::where('category_id', $legacy->id)->update(['category_id' => $fallbackCategory->id]);
                }
            }

            // Delete legacy children first, then parents
            Category::whereNotIn('slug', $validSlugs)->whereNotNull('parent_id')->delete();
            Category::whereNotIn('slug', $validSlugs)->delete();
        }
    }
}
