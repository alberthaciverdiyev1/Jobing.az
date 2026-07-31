using MediatR;

namespace Jobing.Application.Features.Profile.Commands;

public class ChangePasswordCommand : IRequest<Unit>
{
    public int UserId { get; set; }
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
