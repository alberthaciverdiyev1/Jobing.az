using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Users.DTOs;

namespace Jobing.Application.Common.Interfaces;

public interface IAdminUserService
{
    Task<PagedResult<AdminUserDto>> GetUsersPagedAsync(int page, int pageSize);
    Task<List<RoleDto>> GetRolesAsync();
    Task<AdminUserDto> GetByIdAsync(Guid id);
    Task UpdateRolesAsync(Guid id, List<string> roles);
    Task ToggleActiveAsync(Guid id);
}
