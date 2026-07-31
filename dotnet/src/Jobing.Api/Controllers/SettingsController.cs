using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Settings.Commands;
using Jobing.Application.Features.Settings.DTOs;
using Jobing.Application.Features.Settings.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly ISender _sender;

    public SettingsController(ISender sender) => _sender = sender;

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyDictionary<string, Dictionary<string, string>>>> GetAllActive()
        => Ok(await _sender.Send(new GetSettingsDictionaryQuery()));

    [Authorize(Policy = "AdminOnly")]
    [HttpGet]
    public async Task<ActionResult<PagedResult<SettingDto>>> GetAll([FromQuery] GetSettingsQuery query)
        => Ok(await _sender.Send(query));

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SettingDto>> GetById(Guid id)
    {
        var r = await _sender.Send(new GetSettingByIdQuery { Id = id });
        return r is null ? NotFound() : Ok(r);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("key/{key}")]
    public async Task<ActionResult<SettingDto>> GetByKey(string key)
    {
        var r = await _sender.Send(new GetSettingByKeyQuery { Key = key });
        return r is null ? NotFound() : Ok(r);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<ActionResult<SettingDto>> Create(CreateSettingCommand command)
    {
        var r = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = r.Id }, r);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateSettingCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _sender.Send(new DeleteSettingCommand { Id = id });
        return NoContent();
    }
}
