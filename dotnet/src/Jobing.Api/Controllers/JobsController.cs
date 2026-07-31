using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Jobs;
using Jobing.Application.Features.Jobs.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly IJobService _service;
    public JobsController(IJobService service) => _service = service;

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<PagedResult<JobDto>>> GetAll([FromQuery] JobPaginationParams pagination)
        => Ok(await _service.GetPagedAsync(pagination));

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<JobDto>> GetById(Guid id)
    {
        var r = await _service.GetByIdAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [AllowAnonymous]
    [HttpPut("{id:guid}/view")]
    public async Task<IActionResult> IncrementViewCount(Guid id)
    {
        try { await _service.IncrementViewCountAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<JobDto>> Create(CreateJobRequest request)
    {
        try { var r = await _service.CreateAsync(request); return CreatedAtAction(nameof(GetById), new { id = r.Id }, r); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateJobRequest request)
    {
        try { await _service.UpdateAsync(id, request); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
