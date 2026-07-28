namespace Jobing.Application.Features.BlogCategories.DTOs;

public class UpdateBlogCategoryRequest
{
    public Dictionary<string, string> Name { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
