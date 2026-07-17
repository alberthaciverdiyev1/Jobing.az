namespace Jobing.Application.Features.Filters.DTOs;

public class UpdateFilterRequest
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
