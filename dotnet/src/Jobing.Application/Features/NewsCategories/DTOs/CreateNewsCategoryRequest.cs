namespace Jobing.Application.Features.NewsCategories.DTOs;

public class CreateNewsCategoryRequest
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
