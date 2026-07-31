namespace Jobing.Domain.Entities;

public class Company
{
    public int Id { get; set; }
    public int? CreatedByUserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Dictionary<string, string>? Description { get; set; }
    public string? Logo { get; set; }
    public string? Website { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public int? CityId { get; set; }
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation
    public User? CreatedBy { get; set; }
    public City? City { get; set; }
    public ICollection<Job> Jobs { get; set; } = new List<Job>();
    public ICollection<HrProfile> HrProfiles { get; set; } = new List<HrProfile>();
}
