namespace Jobing.Domain.Entities;

public class HrProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? CompanyId { get; set; }
    public string? Position { get; set; }
    public string? Department { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public Company? Company { get; set; }
}
