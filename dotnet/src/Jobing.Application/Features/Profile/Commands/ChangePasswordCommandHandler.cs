using Jobing.Application.Common.Interfaces;
using MediatR;

namespace Jobing.Application.Features.Profile.Commands;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Unit>
{
    private readonly IProfileService _profileService;

    public ChangePasswordCommandHandler(IProfileService profileService) => _profileService = profileService;

    public async Task<Unit> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        await _profileService.ChangePasswordAsync(request.UserId, request);
        return Unit.Value;
    }
}
