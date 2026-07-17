using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Cities;
using Jobing.Application.Features.Cities.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CitiesController : ControllerBase
{
    private readonly ICityService _cityService;

    public CitiesController(ICityService cityService) => _cityService = cityService;

    [HttpGet]
    public async Task<ActionResult<PagedResult<CityDto>>> GetAll([FromQuery] PaginationParams pagination)
    {
        return Ok(await _cityService.GetPagedAsync(pagination));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CityDto>> GetById(Guid id)
    {
        var result = await _cityService.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CityDto>> Create(CreateCityRequest request)
    {
        try
        {
            var city = await _cityService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = city.Id }, city);
        }
        catch (FluentValidation.ValidationException ex)
        {
            return BadRequest(ex.Errors);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateCityRequest request)
    {
        try
        {
            await _cityService.UpdateAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _cityService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
