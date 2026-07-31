using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Users.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Services;

public class AdminUserService : IAdminUserService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<int>> _roleManager;

    public AdminUserService(UserManager<User> userManager, RoleManager<IdentityRole<int>> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<PagedResult<AdminUserDto>> GetUsersPagedAsync(int page, int pageSize)
    {
        var query = _userManager.Users
            .Include(u => u.Profile)
            .Where(u => u.DeletedAt == null)
            .OrderByDescending(u => u.CreatedAt);

        var totalCount = await query.CountAsync();
        var users = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        var items = new List<AdminUserDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            items.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email,
                Profile = user.Profile is null ? null : new AdminUserProfileDto
                {
                    Name = user.Profile.Name,
                    Surname = user.Profile.Surname
                },
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                Roles = roles.ToList()
            });
        }

        return new PagedResult<AdminUserDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public Task<List<RoleDto>> GetRolesAsync()
        => _roleManager.Roles
            .OrderBy(r => r.Name!)
            .Select(r => new RoleDto { Id = r.Id, Name = r.Name })
            .ToListAsync();

    public async Task<AdminUserDto> GetByIdAsync(int id)
    {
        var user = await _userManager.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new NotFoundException(nameof(User), id);

        var roles = await _userManager.GetRolesAsync(user);
        return new AdminUserDto
        {
            Id = user.Id,
            Email = user.Email,
            Profile = user.Profile is null ? null : new AdminUserProfileDto
            {
                Name = user.Profile.Name,
                Surname = user.Profile.Surname
            },
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            Roles = roles.ToList()
        };
    }

    public async Task UpdateRolesAsync(int id, List<string> roles)
    {
        var user = await _userManager.FindByIdAsync(id.ToString())
            ?? throw new NotFoundException(nameof(User), id);

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);

        if (roles.Count > 0)
        {
            var result = await _userManager.AddToRolesAsync(user, roles);
            if (!result.Succeeded)
                throw new DomainException("Failed to update roles");
        }
    }

    public async Task ToggleActiveAsync(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString())
            ?? throw new NotFoundException(nameof(User), id);

        user.IsActive = !user.IsActive;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new DomainException("Failed to toggle active status");
    }
}
