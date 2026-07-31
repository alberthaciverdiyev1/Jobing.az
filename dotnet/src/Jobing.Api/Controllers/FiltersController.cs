using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Filters.Commands;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Application.Features.Filters.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/filters")]
public class FiltersController : ControllerBase
{
    private readonly ISender _sender;

    public FiltersController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<PagedResult<FilterDto>>> GetAll([FromQuery] GetFiltersQuery query)
        => Ok(await _sender.Send(query));

    [HttpGet("active")]
    public async Task<ActionResult<IReadOnlyList<FilterDto>>> GetAllActive()
        => Ok(await _sender.Send(new GetActiveFiltersQuery()));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FilterDto>> GetById(Guid id)
    {
        var r = await _sender.Send(new GetFilterByIdQuery { Id = id });
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost]
    public async Task<ActionResult<FilterDto>> Create(CreateFilterCommand command)
    {
        var r = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = r.Id }, r);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateFilterCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _sender.Send(new DeleteFilterCommand { Id = id });
        return NoContent();
    }

    // --- FilterOption endpoints ---

    [HttpGet("options/{id:guid}")]
    public async Task<ActionResult<FilterOptionDto>> GetOptionById(Guid id)
    {
        var r = await _sender.Send(new GetFilterOptionByIdQuery { Id = id });
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost("{filterId:guid}/options")]
    public async Task<ActionResult<FilterOptionDto>> AddOption(Guid filterId, AddFilterOptionCommand command)
    {
        command.FilterId = filterId;
        var r = await _sender.Send(command);
        return CreatedAtAction(nameof(GetOptionById), new { id = r.Id }, r);
    }

    [HttpPut("options/{id:guid}")]
    public async Task<IActionResult> UpdateOption(Guid id, UpdateFilterOptionCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [HttpDelete("options/{id:guid}")]
    public async Task<IActionResult> DeleteOption(Guid id)
    {
        await _sender.Send(new DeleteFilterOptionCommand { Id = id });
        return NoContent();
    }
}
