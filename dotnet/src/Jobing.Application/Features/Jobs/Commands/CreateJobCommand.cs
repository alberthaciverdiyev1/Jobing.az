using Jobing.Application.Features.Jobs.DTOs;
using Jobing.Domain.Enums;
using MediatR;

namespace Jobing.Application.Features.Jobs.Commands;

public class CreateJobCommand : IRequest<JobDto>
{
    public Dictionary<string, string> Title { get; set; } = new();
    public Dictionary<string, string>? Description { get; set; }
    public Dictionary<string, string>? Requirements { get; set; }
    public decimal? MinSalary { get; set; }
    public decimal? MaxSalary { get; set; }
    public Dictionary<string, string>? SalaryText { get; set; }
    public SalaryCurrency? Currency { get; set; }
    public string? ApplicationMethod { get; set; }
    public string? ApplicationUrl { get; set; }
    public Dictionary<string, string> FilterValues { get; set; } = new();
    public Guid? CompanyId { get; set; }
    public Guid? CityId { get; set; }
    public bool IsRemote { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
}
