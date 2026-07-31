namespace Jobing.Domain.Entities;

public class News
{
    public int Id { get; set; }
    public Dictionary<string, string> Title { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
    public Dictionary<string, string>? Content { get; set; }
    public Dictionary<string, string>? Excerpt { get; set; }
    public string? CoverImage { get; set; }
    public int? CategoryId { get; set; }
    public int ViewCount { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public NewsCategory? Category { get; set; }
}
