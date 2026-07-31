using MediatR;

namespace Jobing.Application.Features.Users.Commands;

public class ToggleUserActiveCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
