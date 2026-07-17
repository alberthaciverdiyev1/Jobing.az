using Jobing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jobing.Infrastructure.Data.Configurations;

public class CityConfiguration : IEntityTypeConfiguration<City>
{
    public void Configure(EntityTypeBuilder<City> builder)
    {
        builder.ToTable("cities");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(x => x.Name)
            .HasColumnName("name")
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(x => x.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(x => x.SortOrder)
            .HasColumnName("sort_order")
            .HasDefaultValue(0);

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at");

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(x => x.DeletedAt)
            .HasColumnName("deleted_at");

        builder.HasQueryFilter(x => x.DeletedAt == null);
        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.DeletedAt);
    }
}
