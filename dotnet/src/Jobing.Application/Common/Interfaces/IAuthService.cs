using Jobing.Application.Features.Auth.Commands;
using Jobing.Application.Features.Auth.DTOs;

namespace Jobing.Application.Common.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterCommand request);
    Task<AuthResponse> LoginAsync(LoginCommand request);
    Task ForgotPasswordAsync(ForgotPasswordCommand request);
    Task ResetPasswordAsync(ResetPasswordCommand request);
}
