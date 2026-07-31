using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Settings;
using Jobing.Application.Features.Settings.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly ISettingService _service;
    public SettingsController(ISettingService service) => _service = service;

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyDictionary<string, string>>> GetAllActive()
        => Ok(await _service.GetDictionaryAsync());

    [AllowAnonymous]
    [HttpGet("group/{group}")]
    public async Task<ActionResult<IReadOnlyList<SettingDto>>> GetGroup(string group)
        => Ok(await _service.GetGroupAsync(group));

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<PagedResult<SettingDto>>> GetAll([FromQuery] PaginationParams pagination, [FromQuery] string? group)
        => Ok(await _service.GetPagedAsync(pagination, group));

    [Authorize(Roles = "Admin")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SettingDto>> GetById(Guid id)
    {
        var r = await _service.GetByIdAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("key/{key}")]
    public async Task<ActionResult<SettingDto>> GetByKey(string key)
    {
        var r = await _service.GetByKeyAsync(key);
        return r is null ? NotFound() : Ok(r);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<SettingDto>> Create(CreateSettingRequest request)
    {
        try { var r = await _service.CreateAsync(request); return CreatedAtAction(nameof(GetById), new { id = r.Id }, r); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateSettingRequest request)
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
