using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Users.DTOs;
using MediatR;

namespace Jobing.Application.Features.Users.Queries;

public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, List<RoleDto>>
{
    private readonly IAdminUserService _adminUserService;

    public GetRolesQueryHandler(IAdminUserService adminUserService) => _adminUserService = adminUserService;

    public Task<List<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
        => _adminUserService.GetRolesAsync();
}
