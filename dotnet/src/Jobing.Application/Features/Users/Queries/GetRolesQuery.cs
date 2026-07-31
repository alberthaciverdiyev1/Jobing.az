using Jobing.Application.Features.Users.DTOs;
using MediatR;

namespace Jobing.Application.Features.Users.Queries;

public class GetRolesQuery : IRequest<List<RoleDto>>
{
}
