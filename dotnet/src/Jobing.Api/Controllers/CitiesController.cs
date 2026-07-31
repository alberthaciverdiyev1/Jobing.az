using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Cities.Commands;
using Jobing.Application.Features.Cities.DTOs;
using Jobing.Application.Features.Cities.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CitiesController : ControllerBase
{
    private readonly ISender _sender;

    public CitiesController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<PagedResult<CityDto>>> GetAll([FromQuery] GetCitiesQuery query)
        => Ok(await _sender.Send(query));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CityDto>> GetById(Guid id)
    {
        var result = await _sender.Send(new GetCityByIdQuery { Id = id });
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CityDto>> Create(CreateCityCommand command)
    {
        var city = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = city.Id }, city);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateCityCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _sender.Send(new DeleteCityCommand { Id = id });
        return NoContent();
    }
}
