using Jobing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jobing.Infrastructure.Data.Configurations;

public class SeoSettingConfiguration : IEntityTypeConfiguration<SeoSetting>
{
    public void Configure(EntityTypeBuilder<SeoSetting> builder)
    {
        builder.ToTable("seo_settings");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property(x => x.PageKey).HasMaxLength(100).IsRequired();

        builder.Property(x => x.Title)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null))
            .HasColumnType("jsonb");
        builder.Property(x => x.Description)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null))
            .HasColumnType("jsonb");
        builder.Property(x => x.Keywords)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null))
            .HasColumnType("jsonb");
        builder.Property(x => x.OgImage).HasMaxLength(500);
        builder.Property(x => x.IsActive).HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.UpdatedAt);
        builder.Property(x => x.DeletedAt);

        builder.HasQueryFilter(x => x.DeletedAt == null);

        builder.HasIndex(x => x.PageKey).IsUnique();
        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.DeletedAt);
    }
}
