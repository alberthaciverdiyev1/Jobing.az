using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Seo.Commands;
using Jobing.Application.Features.Seo.DTOs;
using Jobing.Application.Features.Seo.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/seo")]
public class SeoController : ControllerBase
{
    private readonly ISender _sender;

    public SeoController(ISender sender) => _sender = sender;

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyDictionary<string, SeoSettingDto>>> GetAllActive()
        => Ok(await _sender.Send(new GetActiveSeoSettingsQuery()));

    [AllowAnonymous]
    [HttpGet("{pageKey}")]
    public async Task<ActionResult<SeoSettingDto>> GetByPageKey(string pageKey)
    {
        var r = await _sender.Send(new GetSeoSettingByPageKeyQuery { PageKey = pageKey });
        return r is null ? NotFound() : Ok(r);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet]
    public async Task<ActionResult<PagedResult<SeoSettingDto>>> GetAll([FromQuery] GetSeoSettingsQuery query)
        => Ok(await _sender.Send(query));

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("id/{id:int}")]
    public async Task<ActionResult<SeoSettingDto>> GetById(int id)
    {
        var r = await _sender.Send(new GetSeoSettingByIdQuery { Id = id });
        return r is null ? NotFound() : Ok(r);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<ActionResult<SeoSettingDto>> Create(CreateSeoSettingCommand command)
    {
        var r = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = r.Id }, r);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateSeoSettingCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _sender.Send(new DeleteSeoSettingCommand { Id = id });
        return NoContent();
    }
}
