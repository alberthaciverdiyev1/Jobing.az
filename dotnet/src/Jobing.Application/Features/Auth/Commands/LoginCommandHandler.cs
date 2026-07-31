using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Auth.DTOs;
using MediatR;

namespace Jobing.Application.Features.Auth.Commands;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IAuthService _authService;

    public LoginCommandHandler(IAuthService authService) => _authService = authService;

    public Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        => _authService.LoginAsync(request);
}
