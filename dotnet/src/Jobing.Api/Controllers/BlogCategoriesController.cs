using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.BlogCategories;
using Jobing.Application.Features.BlogCategories.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/blog-categories")]
public class BlogCategoriesController : ControllerBase
{
    private readonly IBlogCategoryService _service;
    public BlogCategoriesController(IBlogCategoryService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<BlogCategoryDto>>> GetAll([FromQuery] PaginationParams pagination)
        => Ok(await _service.GetPagedAsync(pagination));

    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyList<BlogCategoryDto>>> GetAllActive()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogCategoryDto>> GetById(Guid id)
    {
        var r = await _service.GetByIdAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<BlogCategoryDto>> GetBySlug(string slug)
    {
        var r = await _service.GetBySlugAsync(slug);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost]
    public async Task<ActionResult<BlogCategoryDto>> Create(CreateBlogCategoryRequest request)
    {
        try { var r = await _service.CreateAsync(request); return CreatedAtAction(nameof(GetById), new { id = r.Id }, r); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBlogCategoryRequest request)
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
