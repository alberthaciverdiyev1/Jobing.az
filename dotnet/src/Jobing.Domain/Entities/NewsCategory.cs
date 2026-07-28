namespace Jobing.Domain.Entities;

public class NewsCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Dictionary<string, string> Name { get; set; } = new();
    public string Slug { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<News> News { get; set; } = new List<News>();
}
