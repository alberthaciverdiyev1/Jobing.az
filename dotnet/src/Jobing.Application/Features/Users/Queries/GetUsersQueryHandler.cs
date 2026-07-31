using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Users.DTOs;
using MediatR;

namespace Jobing.Application.Features.Users.Queries;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PagedResult<AdminUserDto>>
{
    private readonly IAdminUserService _adminUserService;

    public GetUsersQueryHandler(IAdminUserService adminUserService) => _adminUserService = adminUserService;

    public Task<PagedResult<AdminUserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        => _adminUserService.GetUsersPagedAsync(request.Page, request.PageSize);
}
