namespace Jobing.Application.Features.Filters.DTOs;

public class FilterOptionDto
{
    public Guid Id { get; set; }
    public Guid FilterId { get; set; }
    public string Value { get; set; } = string.Empty;
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}
