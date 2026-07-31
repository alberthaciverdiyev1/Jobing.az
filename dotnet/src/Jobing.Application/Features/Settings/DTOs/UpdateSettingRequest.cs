namespace Jobing.Application.Features.Settings.DTOs;

public class UpdateSettingRequest
{
    public string Key { get; set; } = string.Empty;
    public string Group { get; set; } = "general";
    public string? Value { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
