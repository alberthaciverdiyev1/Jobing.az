namespace Jobing.Domain.Entities;

public class News
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? Excerpt { get; set; }
    public string? CoverImage { get; set; }
    public Guid? CategoryId { get; set; }
    public int ViewCount { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public NewsCategory? Category { get; set; }
}
