namespace Jobing.Application.Features.Filters.DTOs;

public class CreateFilterOptionRequest
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
