namespace Jobing.Domain.Entities;

public class City
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Dictionary<string, string> Name { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
