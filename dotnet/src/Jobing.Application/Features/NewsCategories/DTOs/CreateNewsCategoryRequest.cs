namespace Jobing.Application.Features.NewsCategories.DTOs;

public class CreateNewsCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
