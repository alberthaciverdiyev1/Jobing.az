namespace Jobing.Application.Features.Profile.DTOs;

public class UpdateProfileRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Surname { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public string? Title { get; set; }
    public string? Bio { get; set; }
}
