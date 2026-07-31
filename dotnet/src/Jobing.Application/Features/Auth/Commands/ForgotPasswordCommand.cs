using MediatR;

namespace Jobing.Application.Features.Auth.Commands;

public class ForgotPasswordCommand : IRequest<Unit>
{
    public string Email { get; set; } = string.Empty;
}
