using MediatR;

namespace Jobing.Application.Features.Users.Commands;

public class ToggleUserActiveCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
