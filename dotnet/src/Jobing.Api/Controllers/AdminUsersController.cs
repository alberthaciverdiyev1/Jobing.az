using System.Security.Claims;
using Jobing.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/users")]
public class AdminUsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public AdminUsersController(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 15)
    {
        var query = _userManager.Users
            .Include(u => u.Profile)
            .Where(u => u.DeletedAt == null)
            .OrderByDescending(u => u.CreatedAt);

        var totalCount = await query.CountAsync();
        var users = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        var items = new List<object>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            items.Add(new
            {
                user.Id,
                user.Email,
                Profile = user.Profile == null ? null : new
                {
                    user.Profile.Name,
                    user.Profile.Surname
                },
                user.IsActive,
                user.CreatedAt,
                Roles = roles.ToList()
            });
        }

        return Ok(new
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    [HttpGet("roles/all")]
    public ActionResult GetAllRoles()
    {
        var roles = _roleManager.Roles
            .OrderBy(r => r.Name!)
            .Select(r => new { r.Id, r.Name })
            .ToList();
        return Ok(roles);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var user = await _userManager.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null) return NotFound(new { message = "User not found" });

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new
        {
            user.Id,
            user.Email,
            Profile = user.Profile == null ? null : new
            {
                user.Profile.Name,
                user.Profile.Surname
            },
            user.IsActive,
            Roles = roles.ToList()
        });
    }

    [HttpPut("{id:guid}/roles")]
    public async Task<IActionResult> UpdateRoles(Guid id, [FromBody] UpdateRolesRequest request)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null) return NotFound(new { message = "User not found" });

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);

        if (request.Roles.Count > 0)
        {
            var result = await _userManager.AddToRolesAsync(user, request.Roles);
            if (!result.Succeeded)
                return BadRequest(new { message = "Failed to update roles", errors = result.Errors });
        }

        return NoContent();
    }

    [HttpPost("{id:guid}/toggle-active")]
    public async Task<IActionResult> ToggleActive(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null) return NotFound(new { message = "User not found" });

        user.IsActive = !user.IsActive;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { message = "Failed to toggle active status" });

        return NoContent();
    }
}

public class UpdateRolesRequest
{
    public List<string> Roles { get; set; } = new();
}
