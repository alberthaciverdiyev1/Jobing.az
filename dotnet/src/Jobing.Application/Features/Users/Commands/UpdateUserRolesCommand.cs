using MediatR;

namespace Jobing.Application.Features.Users.Commands;

public class UpdateUserRolesCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public List<string> Roles { get; set; } = new();
}
