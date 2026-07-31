using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Users.DTOs;
using MediatR;

namespace Jobing.Application.Features.Users.Queries;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, AdminUserDto>
{
    private readonly IAdminUserService _adminUserService;

    public GetUserByIdQueryHandler(IAdminUserService adminUserService) => _adminUserService = adminUserService;

    public Task<AdminUserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        => _adminUserService.GetByIdAsync(request.Id);
}
