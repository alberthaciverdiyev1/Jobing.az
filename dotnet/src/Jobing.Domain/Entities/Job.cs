using Jobing.Domain.Enums;

namespace Jobing.Domain.Entities;

public class Job
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Dictionary<string, string> Title { get; set; } = new();
    public Dictionary<string, string>? Description { get; set; }
    public Dictionary<string, string>? Requirements { get; set; }
    public decimal? MinSalary { get; set; }
    public decimal? MaxSalary { get; set; }
    public Dictionary<string, string>? SalaryText { get; set; }
    public SalaryCurrency? Currency { get; set; }
    public int ViewCount { get; set; }
    public string? ApplicationMethod { get; set; }
    public string? ApplicationUrl { get; set; }
    public Dictionary<string, string> FilterValues { get; set; } = new();
    public Guid? CompanyId { get; set; }
    public Guid? CityId { get; set; }
    public Guid? CreatedById { get; set; }
    public bool IsRemote { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation
    public Company? Company { get; set; }
    public City? City { get; set; }
    public User? CreatedBy { get; set; }
}
