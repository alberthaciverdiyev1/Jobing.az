namespace Jobing.Application.Features.NewsCategories.DTOs;

public class NewsCategoryDto
{
    public int Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public int NewsCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
