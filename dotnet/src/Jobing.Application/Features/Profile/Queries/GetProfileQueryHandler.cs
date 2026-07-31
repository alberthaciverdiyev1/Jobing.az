using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Profile.DTOs;
using MediatR;

namespace Jobing.Application.Features.Profile.Queries;

public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, ProfileDto>
{
    private readonly IProfileService _profileService;

    public GetProfileQueryHandler(IProfileService profileService) => _profileService = profileService;

    public Task<ProfileDto> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        => _profileService.GetProfileAsync(request.UserId);
}
