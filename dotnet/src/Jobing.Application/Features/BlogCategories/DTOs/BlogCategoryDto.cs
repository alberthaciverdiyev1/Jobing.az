namespace Jobing.Application.Features.BlogCategories.DTOs;

public class BlogCategoryDto
{
    public int Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public int PostCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
