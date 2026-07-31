namespace Jobing.Domain.Entities;

public class Filter
{
    public int Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public string Key { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation
    public List<FilterOption> Options { get; set; } = new();
}
