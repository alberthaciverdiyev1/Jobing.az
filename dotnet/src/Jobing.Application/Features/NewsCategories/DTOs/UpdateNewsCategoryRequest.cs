namespace Jobing.Application.Features.NewsCategories.DTOs;

public class UpdateNewsCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
