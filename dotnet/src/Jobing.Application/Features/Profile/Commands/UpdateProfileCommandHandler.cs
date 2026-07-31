using Jobing.Application.Common.Interfaces;
using MediatR;

namespace Jobing.Application.Features.Profile.Commands;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, Unit>
{
    private readonly IProfileService _profileService;

    public UpdateProfileCommandHandler(IProfileService profileService) => _profileService = profileService;

    public async Task<Unit> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        await _profileService.UpdateProfileAsync(request.UserId, request);
        return Unit.Value;
    }
}
