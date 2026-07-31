namespace Jobing.Domain.Entities;

public class SeoSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string PageKey { get; set; } = string.Empty;
    public Dictionary<string, string>? Title { get; set; }
    public Dictionary<string, string>? Description { get; set; }
    public Dictionary<string, string>? Keywords { get; set; }
    public string? OgImage { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
