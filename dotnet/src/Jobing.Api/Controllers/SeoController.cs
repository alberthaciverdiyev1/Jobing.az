using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Seo;
using Jobing.Application.Features.Seo.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/seo")]
public class SeoController : ControllerBase
{
    private readonly ISeoSettingService _service;
    public SeoController(ISeoSettingService service) => _service = service;

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyDictionary<string, SeoSettingDto>>> GetAllActive()
        => Ok(await _service.GetAllActiveAsync());

    [AllowAnonymous]
    [HttpGet("{pageKey}")]
    public async Task<ActionResult<SeoSettingDto>> GetByPageKey(string pageKey)
    {
        var r = await _service.GetByPageKeyAsync(pageKey);
        return r is null ? NotFound() : Ok(r);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<PagedResult<SeoSettingDto>>> GetAll([FromQuery] PaginationParams pagination)
        => Ok(await _service.GetPagedAsync(pagination));

    [Authorize(Roles = "Admin")]
    [HttpGet("id/{id:guid}")]
    public async Task<ActionResult<SeoSettingDto>> GetById(Guid id)
    {
        var r = await _service.GetByIdAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<SeoSettingDto>> Create(CreateSeoSettingRequest request)
    {
        try { var r = await _service.CreateAsync(request); return CreatedAtAction(nameof(GetById), new { id = r.Id }, r); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateSeoSettingRequest request)
    {
        try { await _service.UpdateAsync(id, request); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
