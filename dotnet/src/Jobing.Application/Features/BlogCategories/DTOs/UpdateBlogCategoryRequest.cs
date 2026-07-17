namespace Jobing.Application.Features.BlogCategories.DTOs;

public class UpdateBlogCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
