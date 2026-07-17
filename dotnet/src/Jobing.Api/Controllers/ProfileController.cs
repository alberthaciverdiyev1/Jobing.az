using System.Security.Claims;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Profile.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService) => _profileService = profileService;

    private Guid GetUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException("User not found in token");
        return Guid.Parse(sub);
    }

    [HttpGet]
    public async Task<ActionResult<ProfileDto>> GetProfile()
    {
        try { return Ok(await _profileService.GetProfileAsync(GetUserId())); }
        catch (KeyNotFoundException) { return NotFound(new { message = "User not found" }); }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        try
        {
            await _profileService.UpdateProfileAsync(GetUserId(), request);
            return NoContent();
        }
        catch (KeyNotFoundException) { return NotFound(new { message = "User not found" }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        try
        {
            await _profileService.ChangePasswordAsync(GetUserId(), request);
            return NoContent();
        }
        catch (KeyNotFoundException) { return NotFound(new { message = "User not found" }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }
}
