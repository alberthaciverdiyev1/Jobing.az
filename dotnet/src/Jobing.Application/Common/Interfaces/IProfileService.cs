using Jobing.Application.Features.Profile.DTOs;

namespace Jobing.Application.Common.Interfaces;

public interface IProfileService
{
    Task<ProfileDto> GetProfileAsync(Guid userId);
    Task UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
}
