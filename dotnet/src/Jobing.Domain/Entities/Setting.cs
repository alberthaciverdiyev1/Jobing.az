namespace Jobing.Domain.Entities;

public class Setting
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public Dictionary<string, string>? Value { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
