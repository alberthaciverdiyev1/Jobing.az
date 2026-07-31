using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace Jobing.Api.Extensions;

public static class DataSeedingExtensions
{
    public static async Task<WebApplication> SeedDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var sp = scope.ServiceProvider;
        var context = sp.GetRequiredService<AppDbContext>();
        var userManager = sp.GetRequiredService<UserManager<User>>();
        var roleManager = sp.GetRequiredService<RoleManager<IdentityRole<int>>>();
        await DataSeeder.SeedAsync(context, userManager, roleManager);

        return app;
    }
}
