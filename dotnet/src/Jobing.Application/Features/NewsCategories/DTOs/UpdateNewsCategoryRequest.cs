namespace Jobing.Application.Features.NewsCategories.DTOs;

public class UpdateNewsCategoryRequest
{
    public Dictionary<string, string> Name { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
