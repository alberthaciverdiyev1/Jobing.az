namespace Jobing.Application.Features.BlogCategories.DTOs;

public class CreateBlogCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
