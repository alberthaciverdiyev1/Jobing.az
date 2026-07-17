using Jobing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jobing.Infrastructure.Data.Configurations;

public class FilterOptionConfiguration : IEntityTypeConfiguration<FilterOption>
{
    public void Configure(EntityTypeBuilder<FilterOption> builder)
    {
        builder.ToTable("filter_options");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(x => x.FilterId).HasColumnName("filter_id").IsRequired();
        builder.Property(x => x.Value).HasColumnName("value").HasMaxLength(100).IsRequired();
        builder.Property(x => x.Name).HasColumnName("name").HasColumnType("jsonb").IsRequired();
        builder.Property(x => x.SortOrder).HasColumnName("sort_order").HasDefaultValue(0);
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.DeletedAt).HasColumnName("deleted_at");

        builder.HasQueryFilter(x => x.DeletedAt == null);

        builder.HasOne(x => x.Filter)
            .WithMany(x => x.Options)
            .HasForeignKey(x => x.FilterId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.FilterId);
        builder.HasIndex(x => x.Value);
        builder.HasIndex(x => x.DeletedAt);
    }
}
