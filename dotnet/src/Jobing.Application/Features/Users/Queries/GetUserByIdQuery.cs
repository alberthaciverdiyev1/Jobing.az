using Jobing.Application.Features.Users.DTOs;
using MediatR;

namespace Jobing.Application.Features.Users.Queries;

public class GetUserByIdQuery : IRequest<AdminUserDto>
{
    public Guid Id { get; set; }
}
