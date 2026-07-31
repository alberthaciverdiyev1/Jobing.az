namespace Jobing.Application.Features.Users.DTOs;

public class UpdateRolesRequest
{
    public List<string> Roles { get; set; } = new();
}
