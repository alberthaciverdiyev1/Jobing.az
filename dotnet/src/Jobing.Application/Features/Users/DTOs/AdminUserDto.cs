namespace Jobing.Application.Features.Users.DTOs;

public class AdminUserDto
{
    public int Id { get; set; }
    public string? Email { get; set; }
    public AdminUserProfileDto? Profile { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> Roles { get; set; } = new();
}

public class AdminUserProfileDto
{
    public string? Name { get; set; }
    public string? Surname { get; set; }
}
