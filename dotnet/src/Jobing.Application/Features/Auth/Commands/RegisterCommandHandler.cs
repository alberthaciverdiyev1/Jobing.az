using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Auth.DTOs;
using MediatR;

namespace Jobing.Application.Features.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IAuthService _authService;

    public RegisterCommandHandler(IAuthService authService) => _authService = authService;

    public Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        => _authService.RegisterAsync(request);
}
