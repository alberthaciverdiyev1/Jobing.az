using System.Security.Claims;
using Jobing.Application.Features.Profile.Commands;
using Jobing.Application.Features.Profile.DTOs;
using Jobing.Application.Features.Profile.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly ISender _sender;

    public ProfileController(ISender sender) => _sender = sender;

    private Guid GetUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException("User not found in token");
        return Guid.Parse(sub);
    }

    [HttpGet]
    public async Task<ActionResult<ProfileDto>> GetProfile()
        => Ok(await _sender.Send(new GetProfileQuery { UserId = GetUserId() }));

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(UpdateProfileCommand command)
    {
        command.UserId = GetUserId();
        await _sender.Send(command);
        return NoContent();
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordCommand command)
    {
        command.UserId = GetUserId();
        await _sender.Send(command);
        return NoContent();
    }
}
