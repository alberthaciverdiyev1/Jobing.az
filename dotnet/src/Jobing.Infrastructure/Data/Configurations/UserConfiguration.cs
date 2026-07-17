using Jobing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jobing.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(x => x.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
        builder.Property(x => x.PasswordHash).HasColumnName("password_hash").IsRequired();
        builder.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(50);
        builder.Property(x => x.Role).HasColumnName("role").HasMaxLength(50).HasConversion<string>().IsRequired();
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.DeletedAt).HasColumnName("deleted_at");

        builder.HasQueryFilter(x => x.DeletedAt == null);
        builder.HasIndex(x => x.Email).IsUnique();
        builder.HasIndex(x => x.DeletedAt);
    }
}
