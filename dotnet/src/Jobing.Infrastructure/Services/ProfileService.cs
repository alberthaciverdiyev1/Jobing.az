using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Profile.DTOs;
using Jobing.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Services;

public class ProfileService : IProfileService
{
    private readonly UserManager<User> _userManager;

    public ProfileService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<ProfileDto> GetProfileAsync(Guid userId)
    {
        var user = await _userManager.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new KeyNotFoundException("User not found");

        var roles = await _userManager.GetRolesAsync(user);

        return new ProfileDto
        {
            Id = user.Id,
            Email = user.Email!,
            Phone = user.PhoneNumber,
            Name = user.Profile?.Name ?? "",
            Surname = user.Profile?.Surname,
            Avatar = user.Profile?.Avatar,
            Title = user.Profile?.Title,
            Bio = user.Profile?.Bio,
            Roles = roles.ToList(),
            CreatedAt = user.CreatedAt
        };
    }

    public async Task UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _userManager.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new KeyNotFoundException("User not found");

        user.PhoneNumber = request.Phone;
        user.UpdatedAt = DateTime.UtcNow;

        if (user.Profile == null)
        {
            user.Profile = new UserProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id
            };
        }

        user.Profile.Name = request.Name;
        user.Profile.Surname = request.Surname;
        user.Profile.Avatar = request.Avatar;
        user.Profile.Title = request.Title;
        user.Profile.Bio = request.Bio;
        user.Profile.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Profile update failed: {errors}");
        }
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new KeyNotFoundException("User not found");

        var result = await _userManager.ChangePasswordAsync(
            user, request.CurrentPassword, request.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Password change failed: {errors}");
        }
    }
}
