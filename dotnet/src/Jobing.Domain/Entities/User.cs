using Microsoft.AspNetCore.Identity;

namespace Jobing.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation
    public UserProfile? Profile { get; set; }
    public Company? Company { get; set; }
    public HrProfile? HrProfile { get; set; }
}
