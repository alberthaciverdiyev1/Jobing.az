namespace Jobing.Application.Features.Filters.DTOs;

public class FilterDto
{
    public Guid Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public string Key { get; set; } = string.Empty;
    public List<FilterOptionDto> Options { get; set; } = new();
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
