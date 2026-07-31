using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Users.DTOs;
using MediatR;

namespace Jobing.Application.Features.Users.Queries;

public class GetUsersQuery : IRequest<PagedResult<AdminUserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 15;
}
