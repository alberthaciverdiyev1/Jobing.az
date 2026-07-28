namespace Jobing.Application.Features.News.DTOs;

public class NewsDto
{
    public Guid Id { get; set; }
    public Dictionary<string, string> Title { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
    public Dictionary<string, string>? Content { get; set; }
    public Dictionary<string, string>? Excerpt { get; set; }
    public string? CoverImage { get; set; }
    public Guid? CategoryId { get; set; }
    public Dictionary<string, string>? CategoryName { get; set; }
    public int ViewCount { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
