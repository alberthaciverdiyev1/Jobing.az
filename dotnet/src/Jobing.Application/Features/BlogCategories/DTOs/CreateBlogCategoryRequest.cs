namespace Jobing.Application.Features.BlogCategories.DTOs;

public class CreateBlogCategoryRequest
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
