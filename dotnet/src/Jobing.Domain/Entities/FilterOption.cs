namespace Jobing.Domain.Entities;

public class FilterOption
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FilterId { get; set; }
    public string Value { get; set; } = string.Empty;
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation
    public Filter Filter { get; set; } = null!;
}
