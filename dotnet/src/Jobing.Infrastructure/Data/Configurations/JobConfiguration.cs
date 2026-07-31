using Jobing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jobing.Infrastructure.Data.Configurations;

public class JobConfiguration : IEntityTypeConfiguration<Job>
{
    public void Configure(EntityTypeBuilder<Job> builder)
    {
        builder.ToTable("jobs");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
        builder.Property(x => x.Title).HasColumnName("title").IsRequired()
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new())
            .HasColumnType("jsonb");
        builder.Property(x => x.Description).HasColumnName("description")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null))
            .HasColumnType("jsonb");
        builder.Property(x => x.Requirements).HasColumnName("requirements")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null))
            .HasColumnType("jsonb");
        builder.Property(x => x.MinSalary).HasColumnName("min_salary").HasColumnType("decimal(18,2)");
        builder.Property(x => x.MaxSalary).HasColumnName("max_salary").HasColumnType("decimal(18,2)");
        builder.Property(x => x.SalaryText).HasColumnName("salary_text")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null))
            .HasColumnType("jsonb");
        builder.Property(x => x.Currency).HasColumnName("currency").HasConversion<string>();
        builder.Property(x => x.ViewCount).HasColumnName("view_count").HasDefaultValue(0);
        builder.Property(x => x.ApplicationMethod).HasColumnName("application_method").HasMaxLength(20);
        builder.Property(x => x.ApplicationUrl).HasColumnName("application_url").HasMaxLength(500);
        builder.Property(x => x.FilterValues).HasColumnName("filter_values")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new());
        builder.Property(x => x.CompanyId).HasColumnName("company_id");
        builder.Property(x => x.CityId).HasColumnName("city_id");
        builder.Property(x => x.CreatedById).HasColumnName("created_by_id");
        builder.Property(x => x.IsRemote).HasColumnName("is_remote").HasDefaultValue(false);
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.ExpiresAt).HasColumnName("expires_at");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.DeletedAt).HasColumnName("deleted_at");

        builder.HasQueryFilter(x => x.DeletedAt == null);

        builder.HasOne(x => x.Company).WithMany(x => x.Jobs).HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(x => x.City).WithMany().HasForeignKey(x => x.CityId).OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(x => x.CreatedBy).WithMany().HasForeignKey(x => x.CreatedById).OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(x => x.DeletedAt);
        builder.HasIndex(x => x.CompanyId);
        builder.HasIndex(x => x.CityId);
        builder.HasIndex(x => x.ExpiresAt);
    }
}
