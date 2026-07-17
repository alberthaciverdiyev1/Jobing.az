using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Auth.DTOs;
using Jobing.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;

    public AuthService(
        UserManager<User> userManager,
        IJwtService jwtService,
        IEmailService emailService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _emailService = emailService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing != null)
            throw new InvalidOperationException("Email is already registered");

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            IsActive = true
        };

        user.Profile = new UserProfile
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = request.Name,
            Surname = request.Surname
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Registration failed: {errors}");
        }

        await _userManager.AddToRoleAsync(user, "User");

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtService.GenerateToken(user, roles);

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email!,
                Name = request.Name,
                Surname = request.Surname,
                Roles = roles.ToList()
            }
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
            throw new UnauthorizedAccessException("Invalid email or password");

        if (!await _userManager.CheckPasswordAsync(user, request.Password))
            throw new UnauthorizedAccessException("Invalid email or password");

        var profile = await _userManager.Users
            .Include(u => u.Profile)
            .FirstAsync(u => u.Id == user.Id);

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtService.GenerateToken(user, roles);

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            User = new UserInfo
            {
                Id = user.Id,
                Email = user.Email!,
                Name = profile.Profile?.Name ?? "",
                Surname = profile.Profile?.Surname,
                Roles = roles.ToList()
            }
        };
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            // Don't reveal whether the user exists
            return;
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var resetLink = $"https://jobing.az/reset-password?email={request.Email}&token={Uri.EscapeDataString(token)}";

        await _emailService.SendPasswordResetEmailAsync(request.Email, resetLink);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email)
            ?? throw new InvalidOperationException("Invalid request");

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Password reset failed: {errors}");
        }
    }
}
