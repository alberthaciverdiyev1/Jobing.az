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

            context.Filters.AddRange(employmentType, experienceLevel, education, category);
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
}
