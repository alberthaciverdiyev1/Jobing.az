namespace Jobing.Application.Features.Settings.DTOs;

public class SettingDto
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public Dictionary<string, string>? Value { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
