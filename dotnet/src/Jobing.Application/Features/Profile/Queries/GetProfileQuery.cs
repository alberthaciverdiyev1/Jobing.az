using Jobing.Application.Features.Profile.DTOs;
using MediatR;

namespace Jobing.Application.Features.Profile.Queries;

public class GetProfileQuery : IRequest<ProfileDto>
{
    public Guid UserId { get; set; }
}
