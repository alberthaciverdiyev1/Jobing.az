using Jobing.Application.Features.Profile.Commands;
using Jobing.Application.Features.Profile.DTOs;

namespace Jobing.Application.Common.Interfaces;

public interface IProfileService
{
    Task<ProfileDto> GetProfileAsync(int userId);
    Task UpdateProfileAsync(int userId, UpdateProfileCommand request);
    Task ChangePasswordAsync(int userId, ChangePasswordCommand request);
}
