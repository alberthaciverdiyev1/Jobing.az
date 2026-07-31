using Jobing.Application.Common.Interfaces;
using MediatR;

namespace Jobing.Application.Features.Users.Commands;

public class UpdateUserRolesCommandHandler : IRequestHandler<UpdateUserRolesCommand, Unit>
{
    private readonly IAdminUserService _adminUserService;

    public UpdateUserRolesCommandHandler(IAdminUserService adminUserService) => _adminUserService = adminUserService;

    public async Task<Unit> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
    {
        await _adminUserService.UpdateRolesAsync(request.Id, request.Roles);
        return Unit.Value;
    }
}
