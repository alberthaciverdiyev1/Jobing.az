using Jobing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jobing.Infrastructure.Data.Configurations;

public class NewsConfiguration : IEntityTypeConfiguration<News>
{
    public void Configure(EntityTypeBuilder<News> builder)
    {
        builder.ToTable("news");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property(x => x.Title)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new())
            .HasColumnType("jsonb")
            .IsRequired();
        builder.Property(x => x.Slug).HasMaxLength(500).IsRequired();
        builder.Property(x => x.Content)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null))
            .HasColumnType("jsonb");
        builder.Property(x => x.Excerpt)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, (System.Text.Json.JsonSerializerOptions?)null))
            .HasColumnType("jsonb");
        builder.Property(x => x.CoverImage).HasMaxLength(500);
        builder.Property(x => x.CategoryId);
        builder.Property(x => x.ViewCount).HasDefaultValue(0);
        builder.Property(x => x.IsPublished).HasDefaultValue(false);
        builder.Property(x => x.PublishedAt);
        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.UpdatedAt);
        builder.Property(x => x.DeletedAt);

        builder.HasQueryFilter(x => x.DeletedAt == null);

        builder.HasOne(x => x.Category)
            .WithMany(x => x.News)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(x => x.Slug).IsUnique();
        builder.HasIndex(x => x.CategoryId);
        builder.HasIndex(x => x.IsPublished);
        builder.HasIndex(x => x.PublishedAt);
        builder.HasIndex(x => x.DeletedAt);
    }
}
