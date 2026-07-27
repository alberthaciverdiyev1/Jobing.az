using System.Reflection;
using FluentValidation;
using Jobing.Application.Features.Auth;
using Jobing.Application.Features.BlogCategories;
using Jobing.Application.Features.Blogs;
using Jobing.Application.Features.Cities;
using Jobing.Application.Features.Filters;
using Jobing.Application.Features.Profile;
using Jobing.Application.Features.News;
using Jobing.Application.Features.NewsCategories;
using Microsoft.Extensions.DependencyInjection;

namespace Jobing.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddAutoMapper(cfg => cfg.AddMaps(Assembly.GetExecutingAssembly()), Array.Empty<Assembly>());

        services.AddScoped<ICityService, CityService>();
        services.AddScoped<IFilterService, FilterService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<IBlogCategoryService, BlogCategoryService>();
        services.AddScoped<INewsService, NewsService>();
        services.AddScoped<INewsCategoryService, NewsCategoryService>();

        return services;
    }
}
