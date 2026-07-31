using Jobing.Application.Common.Interfaces;
using MediatR;

namespace Jobing.Application.Features.Auth.Commands;

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, Unit>
{
    private readonly IAuthService _authService;

    public ForgotPasswordCommandHandler(IAuthService authService) => _authService = authService;

    public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        await _authService.ForgotPasswordAsync(request);
        return Unit.Value;
    }
}
