using Jobing.Application.Features.Users.Commands;
using Jobing.Application.Features.Users.DTOs;
using Jobing.Application.Features.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin/users")]
public class AdminUsersController : ControllerBase
{
    private readonly ISender _sender;

    public AdminUsersController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 15)
        => Ok(await _sender.Send(new GetUsersQuery { Page = page, PageSize = pageSize }));

    [HttpGet("roles/all")]
    public async Task<ActionResult> GetAllRoles()
        => Ok(await _sender.Send(new GetRolesQuery()));

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetById(int id)
        => Ok(await _sender.Send(new GetUserByIdQuery { Id = id }));

    [HttpPut("{id:int}/roles")]
    public async Task<IActionResult> UpdateRoles(int id, [FromBody] UpdateRolesRequest request)
    {
        await _sender.Send(new UpdateUserRolesCommand { Id = id, Roles = request.Roles });
        return NoContent();
    }

    [HttpPost("{id:int}/toggle-active")]
    public async Task<IActionResult> ToggleActive(int id)
    {
        await _sender.Send(new ToggleUserActiveCommand { Id = id });
        return NoContent();
    }
}
