using Jobing.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        await context.Database.MigrateAsync();

        // Roles
        var roles = new[] { "User", "Company", "Hr", "Admin" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }

        // Cities
        if (!await context.Cities.AnyAsync())
        {
            var cities = new List<City>
            {
                new() { Name = new() { ["az"] = "Bakı", ["en"] = "Baku", ["ru"] = "Баку" }, SortOrder = 1 },
                new() { Name = new() { ["az"] = "Gəncə", ["en"] = "Ganja", ["ru"] = "Гянджа" }, SortOrder = 2 },
                new() { Name = new() { ["az"] = "Sumqayıt", ["en"] = "Sumgayit", ["ru"] = "Сумгайыт" }, SortOrder = 3 },
                new() { Name = new() { ["az"] = "Mingəçevir", ["en"] = "Mingachevir", ["ru"] = "Мингечаур" }, SortOrder = 4 },
                new() { Name = new() { ["az"] = "Lənkəran", ["en"] = "Lankaran", ["ru"] = "Ленкорань" }, SortOrder = 5 },
                new() { Name = new() { ["az"] = "Şirvan", ["en"] = "Shirvan", ["ru"] = "Ширван" }, SortOrder = 6 },
                new() { Name = new() { ["az"] = "Naxçıvan", ["en"] = "Nakhchivan", ["ru"] = "Нахичевань" }, SortOrder = 7 },
                new() { Name = new() { ["az"] = "Yevlax", ["en"] = "Yevlakh", ["ru"] = "Евлах" }, SortOrder = 8 },
                new() { Name = new() { ["az"] = "Şəki", ["en"] = "Sheki", ["ru"] = "Шеки" }, SortOrder = 9 },
                new() { Name = new() { ["az"] = "Xırdalan", ["en"] = "Khirdalan", ["ru"] = "Хырдалан" }, SortOrder = 10 },
            };
            context.Cities.AddRange(cities);
            await context.SaveChangesAsync();
        }

        // Filters & FilterOptions
        if (!await context.Filters.AnyAsync())
        {
            var employmentType = new Filter
            {
                Name = new() { ["az"] = "İş növü", ["en"] = "Employment type", ["ru"] = "Тип занятости" },
                Key = "employment_type",
                SortOrder = 1,
                Options = new List<FilterOption>
                {
                    new() { Value = "full-time", Name = new() { ["az"] = "Tam ştat", ["en"] = "Full-time", ["ru"] = "Полная занятость" }, SortOrder = 1 },
                    new() { Value = "part-time", Name = new() { ["az"] = "Yarım ştat", ["en"] = "Part-time", ["ru"] = "Частичная занятость" }, SortOrder = 2 },
                    new() { Value = "remote", Name = new() { ["az"] = "Remote", ["en"] = "Remote", ["ru"] = "Удаленная работа" }, SortOrder = 3 },
                    new() { Value = "freelance", Name = new() { ["az"] = "Frilans", ["en"] = "Freelance", ["ru"] = "Фриланс" }, SortOrder = 4 },
                    new() { Value = "contract", Name = new() { ["az"] = "Müqavilə əsasında", ["en"] = "Contract", ["ru"] = "Контракт" }, SortOrder = 5 },
                }
            };

            var experienceLevel = new Filter
            {
                Name = new() { ["az"] = "Təcrübə", ["en"] = "Experience", ["ru"] = "Опыт работы" },
                Key = "experience_level",
                SortOrder = 2,
                Options = new List<FilterOption>
                {
                    new() { Value = "no-experience", Name = new() { ["az"] = "Təcrübəsiz", ["en"] = "No experience", ["ru"] = "Без опыта" }, SortOrder = 1 },
                    new() { Value = "0-1", Name = new() { ["az"] = "0-1 il", ["en"] = "0-1 year", ["ru"] = "0-1 год" }, SortOrder = 2 },
                    new() { Value = "1-3", Name = new() { ["az"] = "1-3 il", ["en"] = "1-3 years", ["ru"] = "1-3 года" }, SortOrder = 3 },
                    new() { Value = "3-5", Name = new() { ["az"] = "3-5 il", ["en"] = "3-5 years", ["ru"] = "3-5 лет" }, SortOrder = 4 },
                    new() { Value = "5+", Name = new() { ["az"] = "5+ il", ["en"] = "5+ years", ["ru"] = "5+ лет" }, SortOrder = 5 },
                }
            };

            var education = new Filter
            {
                Name = new() { ["az"] = "Təhsil", ["en"] = "Education", ["ru"] = "Образование" },
                Key = "education",
                SortOrder = 3,
                Options = new List<FilterOption>
                {
                    new() { Value = "secondary", Name = new() { ["az"] = "Orta", ["en"] = "Secondary", ["ru"] = "Среднее" }, SortOrder = 1 },
                    new() { Value = "bachelor", Name = new() { ["az"] = "Bakalavr", ["en"] = "Bachelor", ["ru"] = "Бакалавр" }, SortOrder = 2 },
                    new() { Value = "master", Name = new() { ["az"] = "Magistr", ["en"] = "Master", ["ru"] = "Магистр" }, SortOrder = 3 },
                    new() { Value = "phd", Name = new() { ["az"] = "Doktorantura", ["en"] = "PhD", ["ru"] = "Докторантура" }, SortOrder = 4 },
                }
            };

            var category = new Filter
            {
                Name = new() { ["az"] = "Kateqoriya", ["en"] = "Category", ["ru"] = "Категория" },
                Key = "category",
                SortOrder = 4,
                Options = new List<FilterOption>
                {
                    new() { Value = "it", Name = new() { ["az"] = "IT və Proqramlaşdırma", ["en"] = "IT & Programming", ["ru"] = "IT и Программирование" }, SortOrder = 1 },
                    new() { Value = "marketing", Name = new() { ["az"] = "Marketinq və PR", ["en"] = "Marketing & PR", ["ru"] = "Маркетинг и PR" }, SortOrder = 2 },
                    new() { Value = "finance", Name = new() { ["az"] = "Maliyyə və Mühasibatlıq", ["en"] = "Finance & Accounting", ["ru"] = "Финансы и Бухгалтерия" }, SortOrder = 3 },
                    new() { Value = "sales", Name = new() { ["az"] = "Satış", ["en"] = "Sales", ["ru"] = "Продажи" }, SortOrder = 4 },
                    new() { Value = "administration", Name = new() { ["az"] = "İnzibatçılıq", ["en"] = "Administration", ["ru"] = "Администрация" }, SortOrder = 5 },
                    new() { Value = "engineering", Name = new() { ["az"] = "Mühəndislik", ["en"] = "Engineering", ["ru"] = "Инженерия" }, SortOrder = 6 },
                    new() { Value = "healthcare", Name = new() { ["az"] = "Səhiyyə", ["en"] = "Healthcare", ["ru"] = "Здравоохранение" }, SortOrder = 7 },
                    new() { Value = "education", Name = new() { ["az"] = "Təhsil", ["en"] = "Education", ["ru"] = "Образование" }, SortOrder = 8 },
                    new() { Value = "design", Name = new() { ["az"] = "Dizayn", ["en"] = "Design", ["ru"] = "Дизайн" }, SortOrder = 9 },
                    new() { Value = "legal", Name = new() { ["az"] = "Hüquq", ["en"] = "Legal", ["ru"] = "Юриспруденция" }, SortOrder = 10 },
                }
            };

            var workMode = new Filter
            {
                Name = new() { ["az"] = "İş rejimi", ["en"] = "Work mode", ["ru"] = "Режим работы" },
                Key = "work_mode",
                SortOrder = 5,
                Options = new List<FilterOption>
                {
                    new() { Value = "office", Name = new() { ["az"] = "Ofisdə", ["en"] = "On-site", ["ru"] = "В офисе" }, SortOrder = 1 },
                    new() { Value = "hybrid", Name = new() { ["az"] = "Hibrid", ["en"] = "Hybrid", ["ru"] = "Гибридный" }, SortOrder = 2 },
                    new() { Value = "remote", Name = new() { ["az"] = "Remote", ["en"] = "Remote", ["ru"] = "Удаленно" }, SortOrder = 3 },
                }
            };

            context.Filters.AddRange(employmentType, experienceLevel, education, category, workMode);
            await context.SaveChangesAsync();
        }

        // News Categories
        if (!await context.NewsCategories.AnyAsync())
        {
            var newsCategories = new List<NewsCategory>
            {
                new() { Name = new() { ["az"] = "Şirkət", ["en"] = "Company", ["ru"] = "Компания" }, Slug = "sirket", SortOrder = 1 },
                new() { Name = new() { ["az"] = "Texnologiya", ["en"] = "Technology", ["ru"] = "Технологии" }, Slug = "texnologiya", SortOrder = 2 },
                new() { Name = new() { ["az"] = "Karyera", ["en"] = "Career", ["ru"] = "Карьера" }, Slug = "karyera", SortOrder = 3 },
                new() { Name = new() { ["az"] = "İqtisadiyyat", ["en"] = "Economy", ["ru"] = "Экономика" }, Slug = "iqtisadiyyat", SortOrder = 4 },
            };
            context.NewsCategories.AddRange(newsCategories);
            await context.SaveChangesAsync();
        }

        // Blog Categories
        if (!await context.BlogCategories.AnyAsync())
        {
            var blogCategories = new List<BlogCategory>
            {
                new() { Name = new() { ["az"] = "Karyera məsləhətləri", ["en"] = "Career advice", ["ru"] = "Карьерные советы" }, Slug = "karyera-meslehetleri", SortOrder = 1 },
                new() { Name = new() { ["az"] = "Şirkət xəbərləri", ["en"] = "Company news", ["ru"] = "Новости компании" }, Slug = "sirket-xeberleri", SortOrder = 2 },
                new() { Name = new() { ["az"] = "Sektor tendensiyaları", ["en"] = "Industry trends", ["ru"] = "Тенденции отрасли" }, Slug = "sektor-tendensiyalari", SortOrder = 3 },
                new() { Name = new() { ["az"] = "Müsahibə məsləhətləri", ["en"] = "Interview tips", ["ru"] = "Советы по собеседованию" }, Slug = "musahibe-meslehetleri", SortOrder = 4 },
            };
            context.BlogCategories.AddRange(blogCategories);
            await context.SaveChangesAsync();
        }

        // Settings (moved from express-js project; scraping is not part of .NET).
        // Key-based so existing databases gain only the missing keys (e.g. page.*).
        var settings = new List<Setting>
            {
                // Site
                new() { Key = "site.name", Value = V("Jobing.az", "Jobing.az", "Jobing.az"), Description = "Site name" },
                new() { Key = "site.url", Value = V("https://jobing.az", "https://jobing.az", "https://jobing.az"), Description = "Site base URL" },
                new() { Key = "site.logo", Value = V("/Images/Static/Logo.png", "/Images/Static/Logo.png", "/Images/Static/Logo.png"), Description = "Site logo path" },
                new() { Key = "site.description", Value = V("Azərbaycanın ən böyük iş axtarış platforması", "Azerbaijan's largest job search platform", "Крупнейшая платформа поиска работы в Азербайджане"), Description = "Short site description" },
                // Contact
                new() { Key = "contact.phone", Value = V("+994 470 999 05 69", "+994 470 999 05 69", "+994 470 999 05 69"), Description = "Contact phone" },
                new() { Key = "contact.email", Value = V("contact@jobing.az", "contact@jobing.az", "contact@jobing.az"), Description = "Contact email" },
                // Social
                new() { Key = "social.facebook", Value = V("https://www.facebook.com/profile.php?id=61569206672024", "https://www.facebook.com/profile.php?id=61569206672024", "https://www.facebook.com/profile.php?id=61569206672024"), Description = "Facebook page URL" },
                new() { Key = "social.twitter", Value = V("", "", ""), Description = "Twitter/X profile URL" },
                new() { Key = "social.linkedin", Value = V("https://www.linkedin.com/company/jobing-az/", "https://www.linkedin.com/company/jobing-az/", "https://www.linkedin.com/company/jobing-az/"), Description = "LinkedIn company URL" },
                new() { Key = "social.instagram", Value = V("https://www.instagram.com/jobing.az/", "https://www.instagram.com/jobing.az/", "https://www.instagram.com/jobing.az/"), Description = "Instagram profile URL" },
                // Analytics
                new() { Key = "analytics.gtm_id", Value = V("GTM-PV8D5X3V", "GTM-PV8D5X3V", "GTM-PV8D5X3V"), Description = "Google Tag Manager ID" },
                new() { Key = "analytics.meta_pixel_id", Value = V("2033268548067657", "2033268548067657", "2033268548067657"), Description = "Meta Pixel ID" },
                new() { Key = "analytics.ga_id", Value = V("G-2932L7DPW8", "G-2932L7DPW8", "G-2932L7DPW8"), Description = "Google Analytics ID" },
                new() { Key = "analytics.adsense_account", Value = V("ca-pub-6130649958615254", "ca-pub-6130649958615254", "ca-pub-6130649958615254"), Description = "Google AdSense account" },
                // Legal pages
                new() { Key = "page.privacy", Value = V(
                    "Jobing.az (bundan sonra \"Biz\") istifadəçilərin şəxsi məlumatlarının qorunmasına böyük əhəmiyyət verir. Bu Gizlilik Siyasəti, saytımızdan istifadə edərkən hansı məlumatların toplandığını, necə istifadə edildiyini və qorunduğunu izah edir.\n\n1. Toplanan məlumatlar: qeydiyyat zamanı ad, e-poçt ünvanı və telefon nömrəsi; CV yükləyərkən təqdim etdiyiniz məlumatlar; saytdan istifadə məlumatları (IP ünvanı, brauzer növü, ziyarət tarixləri).\n\n2. Məlumatların istifadəsi: məlumatlarınız iş elanları ilə tanış olmaq, vakansiyalara müraciət etmək, hesabınızı idarə etmək və sizə xidmət göstərmək üçün istifadə olunur.\n\n3. Məlumatların qorunması: məlumatlarınız müasir texniki vasitələrlə qorunur və qanuni tələblər istisna olmaqla üçüncü tərəflərə ötürülmür.\n\n4. Hüquqlarınız: istənilən vaxt şəxsi məlumatlarınıza daxil olmaq, onları düzəltmək və ya silmək hüququnuz var. Bunun üçün bizimlə əlaqə saxlayın.",
                    "Jobing.az (hereinafter \"We\") takes the protection of users' personal data very seriously. This Privacy Policy explains what information is collected when you use our website, how it is used, and how it is protected.\n\n1. Information collected: name, email address, and phone number during registration; information you provide when uploading a CV; usage data (IP address, browser type, visit dates).\n\n2. Use of information: your data is used to browse job listings, apply for vacancies, manage your account, and provide you with services.\n\n3. Data protection: your data is protected with modern technical measures and is not shared with third parties except where required by law.\n\n4. Your rights: you have the right to access, correct, or delete your personal data at any time. Contact us to exercise these rights.",
                    "Jobing.az (далее «Мы») уделяет большое внимание защите персональных данных пользователей. Настоящая Политика конфиденциальности объясняет, какие данные собираются при использовании нашего сайта, как они используются и защищаются.\n\n1. Собираемые данные: имя, адрес электронной почты и номер телефона при регистрации; данные, которые вы предоставляете при загрузке резюме; данные об использовании сайта (IP-адрес, тип браузера, даты посещений).\n\n2. Использование данных: ваши данные используются для просмотра вакансий, подачи заявок, управления аккаунтом и предоставления вам услуг.\n\n3. Защита данных: ваши данные защищаются современными техническими средствами и не передаются третьим лицам, за исключением случаев, предусмотренных законом.\n\n4. Ваши права: вы имеете право в любое время получить доступ к своим персональным данным, исправить или удалить их. Свяжитесь с нами, чтобы реализовать эти права."),
                    Description = "Privacy Policy" },
                new() { Key = "page.terms", Value = V(
                    "Bu İstifadə Şərtləri, Jobing.az saytından istifadə edərkən tətbiq olunan qaydaları müəyyən edir. Saytdan istifadə etməklə siz bu şərtləri qəbul edirsiniz.\n\n1. Xidmətin təsviri: Jobing.az iş axtaranlar və işəgötürənlər arasında əlaqə yaradan onlayn platformadır.\n\n2. İstifadə qaydaları: saytdan qanunsuz fəaliyyət üçün istifadə etmək, saxta məlumat yerləşdirmək və ya digər istifadəçilərin hüquqlarını pozmaq qadağandır.\n\n3. Hesab məsuliyyəti: hesabınızın məxfiliyini qorumaq və hesabınız altında aparılan bütün əməliyyatlara görə siz məsuliyyət daşıyırsınız.\n\n4. Məzmun məsuliyyəti: yerləşdirdiyiniz elanların və məlumatların düzgünlüyünə görə siz məsuliyyət daşıyırsınız.\n\n5. Dəyişikliklər: biz bu şərtləri istənilən vaxt dəyişə bilərik. Dəyişikliklər dərc edildikdən sonra qüvvəyə minir.\n\n6. Əlaqə: suallarınız üçün contact@jobing.az ünvanına müraciət edin.",
                    "These Terms of Use set out the rules that apply when you use the Jobing.az website. By using the website, you accept these terms.\n\n1. Description of service: Jobing.az is an online platform that connects job seekers and employers.\n\n2. Rules of use: it is prohibited to use the website for illegal activity, post false information, or violate the rights of other users.\n\n3. Account responsibility: you are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.\n\n4. Content responsibility: you are responsible for the accuracy of the listings and information you post.\n\n5. Changes: we may change these terms at any time. Changes take effect after publication.\n\n6. Contact: for questions, contact contact@jobing.az.",
                    "Настоящие Условия использования устанавливают правила, действующие при использовании сайта Jobing.az. Используя сайт, вы принимаете эти условия.\n\n1. Описание услуги: Jobing.az — онлайн-платформа, связывающая соискателей и работодателей.\n\n2. Правила использования: запрещается использовать сайт для незаконной деятельности, размещать ложную информацию или нарушать права других пользователей.\n\n3. Ответственность за аккаунт: вы несете ответственность за сохранение конфиденциальности вашего аккаунта и за все действия, совершенные под ним.\n\n4. Ответственность за контент: вы несете ответственность за достоверность размещаемых вами объявлений и информации.\n\n5. Изменения: мы можем изменять эти условия в любое время. Изменения вступают в силу после публикации.\n\n6. Контакты: по вопросам обращайтесь по адресу contact@jobing.az."),
                    Description = "Terms of Use" },
                new() { Key = "page.cookies", Value = V(
                    "Bu Kukilər Siyasəti, Jobing.az saytında kukilərdən necə istifadə olunduğunu izah edir.\n\n1. Kukilər nədir: kukilər sayt ziyarəti zamanı brauzerinizdə saxlanılan kiçik mətn fayllarıdır.\n\n2. İstifadə etdiyimiz kukilər: zəruri kukilər (saytın işləməsi üçün), analitik kukilər (Google Analytics, Meta Pixel) və marketinq kukiləri.\n\n3. Kukilərin idarə edilməsi: brauzerinizin parametrləri vasitəsilə kukiləri silə və ya blok edə bilərsiniz. Bununla belə, bəzi funksiyalar işləməyə bilər.\n\n4. Üçüncü tərəf kukiləri: Google Tag Manager, Google Analytics və Meta Pixel kimi xidmətlər öz kukilərindən istifadə edə bilər.\n\n5. Əlaqə: kukilər haqqında suallarınız üçün contact@jobing.az ünvanına müraciət edin.",
                    "This Cookie Policy explains how cookies are used on the Jobing.az website.\n\n1. What are cookies: cookies are small text files stored in your browser when you visit a website.\n\n2. Cookies we use: necessary cookies (for the website to function), analytical cookies (Google Analytics, Meta Pixel), and marketing cookies.\n\n3. Managing cookies: you can delete or block cookies through your browser settings. However, some features may not work.\n\n4. Third-party cookies: services such as Google Tag Manager, Google Analytics, and Meta Pixel may use their own cookies.\n\n5. Contact: for questions about cookies, contact contact@jobing.az.",
                    "Настоящая Политика использования файлов cookie объясняет, как файлы cookie используются на сайте Jobing.az.\n\n1. Что такое файлы cookie: файлы cookie — это небольшие текстовые файлы, сохраняемые в вашем браузере при посещении сайта.\n\n2. Используемые нами файлы cookie: необходимые файлы cookie (для работы сайта), аналитические файлы cookie (Google Analytics, Meta Pixel) и маркетинговые файлы cookie.\n\n3. Управление файлами cookie: вы можете удалять или блокировать файлы cookie через настройки браузера. Однако некоторые функции могут не работать.\n\n4. Сторонние файлы cookie: такие сервисы, как Google Tag Manager, Google Analytics и Meta Pixel, могут использовать собственные файлы cookie.\n\n5. Контакты: по вопросам о файлах cookie обращайтесь по адресу contact@jobing.az."),
                    Description = "Cookie Policy" },
                new() { Key = "page.about", Value = V(
                    "Jobing.az Azərbaycanın aparıcı onlayn iş platformasıdır. Məqsədimiz iş axtaranlarla işəgötürənləri bir araya gətirərək, hər kəsə uyğun karyera imkanları yaratmaqdır.\n\n1. Missiyamız: iş axtarışını sadə və səmərəli etmək; işəgötürənlərə keyfiyyətli namizədlərlə tanış olmaq imkanı vermək.\n\n2. Xidmətlərimiz: vakansiya elanları, CV yerləşdirmə, işəgötürənlər üçün namizəd axtarışı və karyera məsləhətləri.\n\n3. Komandamız: təcrübəli mütəxəssislərdən ibarət komanda platformanın inkişafı və istifadəçi məmnuniyyəti üzərində daim işləyir.\n\n4. Dəyərlərimiz: şəffaflıq, etibarlılıq, istifadəçi məxfiliyinə hörmət və davamlı inkişaf.\n\n5. Əlaqə: bizimlə contact@jobing.az ünvanına yazaraq və ya saytdakı əlaqə forması vasitəsilə əlaqə saxlaya bilərsiniz.",
                    "Jobing.az is a leading online job platform in Azerbaijan. Our goal is to bring job seekers and employers together and create suitable career opportunities for everyone.\n\n1. Our mission: to make job searching simple and effective, and to give employers the opportunity to meet quality candidates.\n\n2. Our services: job postings, CV uploading, candidate search for employers, and career advice.\n\n3. Our team: an experienced team of professionals constantly working on the platform's development and user satisfaction.\n\n4. Our values: transparency, reliability, respect for user privacy, and continuous improvement.\n\n5. Contact: you can reach us by writing to contact@jobing.az or through the contact form on the website.",
                    "Jobing.az — ведущая онлайн-платформа по поиску работы в Азербайджане. Наша цель — соединить соискателей и работодателей и создать подходящие карьерные возможности для каждого.\n\n1. Наша миссия: сделать поиск работы простым и эффективным, а также дать работодателям возможность находить качественных кандидатов.\n\n2. Наши услуги: публикация вакансий, размещение резюме, поиск кандидатов для работодателей и карьерные консультации.\n\n3. Наша команда: команда опытных специалистов постоянно работает над развитием платформы и удовлетворенностью пользователей.\n\n4. Наши ценности: прозрачность, надежность, уважение к конфиденциальности пользователей и постоянное совершенствование.\n\n5. Контакты: вы можете связаться с нами, написав на contact@jobing.az или через форму обратной связи на сайте."),
                    Description = "About Us" },
            };

        var existingSettingKeys = await context.Settings.Select(x => x.Key).ToListAsync();
        var missingSettings = settings.Where(s => !existingSettingKeys.Contains(s.Key)).ToList();
        if (missingSettings.Count > 0)
        {
            context.Settings.AddRange(missingSettings);
            await context.SaveChangesAsync();
        }

        // SEO pages
        var existingSeoPageKeys = await context.SeoSettings.Select(x => x.PageKey).ToListAsync();
        var seoPages = new List<SeoSetting>
        {
            new()
            {
                PageKey = "home",
                Title = V("Vakansiyalar və İş Elanları | Jobing.az", "Vacancies and Job Listings | Jobing.az", "Вакансии и Объявления о работе | Jobing.az"),
                Description = V("Azərbaycanda ən son vakansiyalar, iş elanları və karyera imkanları. Jobing.az ilə iş axtarışınızı başlayın.", "Latest vacancies, job listings, and career opportunities in Azerbaijan. Start your job search with Jobing.az.", "Последние вакансии, объявления о работе и возможности карьеры в Азербайджане. Начните поиск работы с Jobing.az."),
                Keywords = V("vakansiya, iş elanları, iş axtarışı, Azərbaycan vakansiyalar, jobing.az", "vacancy, job listings, job search, Azerbaijan vacancies, jobing.az", "вакансия, объявления о работе, поиск работы, вакансии в Азербайджане, jobing.az"),
                OgImage = "https://jobing.az/Images/Static/Logo.png",
            },
        };
        var missingSeoPages = seoPages.Where(s => !existingSeoPageKeys.Contains(s.PageKey)).ToList();
        if (missingSeoPages.Count > 0)
        {
            context.SeoSettings.AddRange(missingSeoPages);
            await context.SaveChangesAsync();
        }

        // Admin user
        const string adminEmail = "admin@jobing.az";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                IsActive = true,
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }

    private static Dictionary<string, string> V(string az, string en, string ru)
        => new() { ["az"] = az, ["en"] = en, ["ru"] = ru };
}
