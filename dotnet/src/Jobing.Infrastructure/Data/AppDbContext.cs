using Jobing.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<City> Cities => Set<City>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<HrProfile> HrProfiles => Set<HrProfile>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<Filter> Filters => Set<Filter>();
    public DbSet<FilterOption> FilterOptions => Set<FilterOption>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<BlogCategory> BlogCategories => Set<BlogCategory>();
    public DbSet<News> News => Set<News>();
    public DbSet<NewsCategory> NewsCategories => Set<NewsCategory>();
    public DbSet<Setting> Settings => Set<Setting>();
    public DbSet<SeoSetting> SeoSettings => Set<SeoSetting>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.HasDefaultSchema("public");

        // Rename ASP.NET Identity tables
        builder.Entity<User>(e => e.ToTable("users"));
        builder.Entity<IdentityRole<Guid>>(e => e.ToTable("roles"));
        builder.Entity<IdentityUserRole<Guid>>(e => e.ToTable("user_roles"));
        builder.Entity<IdentityUserClaim<Guid>>(e => e.ToTable("user_claims"));
        builder.Entity<IdentityUserLogin<Guid>>(e => e.ToTable("user_logins"));
        builder.Entity<IdentityUserToken<Guid>>(e => e.ToTable("user_tokens"));
        builder.Entity<IdentityRoleClaim<Guid>>(e => e.ToTable("role_claims"));

        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
