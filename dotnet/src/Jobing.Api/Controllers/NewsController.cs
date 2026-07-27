using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.News;
using Jobing.Application.Features.News.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly INewsService _service;
    public NewsController(INewsService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<NewsDto>>> GetAll([FromQuery] PaginationParams pagination)
        => Ok(await _service.GetPagedAsync(pagination));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NewsDto>> GetById(Guid id)
    {
        var r = await _service.GetByIdAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<NewsDto>> GetBySlug(string slug)
    {
        var r = await _service.GetBySlugAsync(slug);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPut("{id:guid}/view")]
    public async Task<IActionResult> IncrementViewCount(Guid id)
    {
        try { await _service.IncrementViewCountAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost]
    public async Task<ActionResult<NewsDto>> Create(CreateNewsRequest request)
    {
        try { var r = await _service.CreateAsync(request); return CreatedAtAction(nameof(GetById), new { id = r.Id }, r); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateNewsRequest request)
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
}
