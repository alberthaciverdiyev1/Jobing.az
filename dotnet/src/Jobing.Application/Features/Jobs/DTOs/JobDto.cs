using Jobing.Domain.Entities;
using Jobing.Domain.Enums;

namespace Jobing.Application.Features.Jobs.DTOs;

public class JobDto
{
    public int Id { get; set; }
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
    public int? CompanyId { get; set; }
    public string? CompanyName { get; set; }
    public int? CityId { get; set; }
    public Dictionary<string, string>? CityName { get; set; }
    public int? CreatedById { get; set; }
    public bool IsRemote { get; set; }
    public bool IsActive { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
