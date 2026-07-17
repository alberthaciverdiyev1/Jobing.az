using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Filters;
using Jobing.Application.Features.Filters.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/filters")]
public class FiltersController : ControllerBase
{
    private readonly IFilterService _service;
    public FiltersController(IFilterService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<FilterDto>>> GetAll([FromQuery] PaginationParams p)
        => Ok(await _service.GetPagedAsync(p));

    [HttpGet("active")]
    public async Task<ActionResult<IReadOnlyList<FilterDto>>> GetAllActive()
        => Ok(await _service.GetAllActiveAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FilterDto>> GetById(Guid id)
    {
        var r = await _service.GetByIdAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost]
    public async Task<ActionResult<FilterDto>> Create(CreateFilterRequest request)
    {
        try { var r = await _service.CreateAsync(request); return CreatedAtAction(nameof(GetById), new { id = r.Id }, r); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateFilterRequest request)
    {
        try { await _service.UpdateAsync(id, request); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    // --- FilterOption endpoints ---

    [HttpGet("options/{id:guid}")]
    public async Task<ActionResult<FilterOptionDto>> GetOptionById(Guid id)
    {
        var r = await _service.GetOptionByIdAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost("{filterId:guid}/options")]
    public async Task<ActionResult<FilterOptionDto>> AddOption(Guid filterId, CreateFilterOptionRequest request)
    {
        try { var r = await _service.AddOptionAsync(filterId, request); return CreatedAtAction(nameof(GetOptionById), new { id = r.Id }, r); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [HttpPut("options/{id:guid}")]
    public async Task<IActionResult> UpdateOption(Guid id, UpdateFilterOptionRequest request)
    {
        try { await _service.UpdateOptionAsync(id, request); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [HttpDelete("options/{id:guid}")]
    public async Task<IActionResult> DeleteOption(Guid id)
    {
        try { await _service.DeleteOptionAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
