using Jobing.Application.Common.Interfaces;
using MediatR;

namespace Jobing.Application.Features.Users.Commands;

public class ToggleUserActiveCommandHandler : IRequestHandler<ToggleUserActiveCommand, Unit>
{
    private readonly IAdminUserService _adminUserService;

    public ToggleUserActiveCommandHandler(IAdminUserService adminUserService) => _adminUserService = adminUserService;

    public async Task<Unit> Handle(ToggleUserActiveCommand request, CancellationToken cancellationToken)
    {
        await _adminUserService.ToggleActiveAsync(request.Id);
        return Unit.Value;
    }
}
