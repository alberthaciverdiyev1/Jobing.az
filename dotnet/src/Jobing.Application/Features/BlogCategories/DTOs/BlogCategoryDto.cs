namespace Jobing.Application.Features.BlogCategories.DTOs;

public class BlogCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public int PostCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
