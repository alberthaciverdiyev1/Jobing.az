using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Blogs;
using Jobing.Application.Features.Blogs.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/blog-posts")]
public class BlogPostsController : ControllerBase
{
    private readonly IBlogService _service;
    public BlogPostsController(IBlogService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<BlogPostDto>>> GetAll([FromQuery] PaginationParams pagination)
        => Ok(await _service.GetPagedAsync(pagination));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPostDto>> GetById(Guid id)
    {
        var r = await _service.GetByIdAsync(id);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<BlogPostDto>> GetBySlug(string slug)
    {
        var r = await _service.GetBySlugAsync(slug);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("{id:guid}/related")]
    public async Task<ActionResult<IReadOnlyList<BlogPostDto>>> GetRelated(Guid id)
        => Ok(await _service.GetRelatedPostsAsync(id));

    [HttpPut("{id:guid}/view")]
    public async Task<IActionResult> IncrementViewCount(Guid id)
    {
        try { await _service.IncrementViewCountAsync(id); return NoContent(); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost]
    public async Task<ActionResult<BlogPostDto>> Create(CreateBlogPostRequest request)
    {
        try { var r = await _service.CreateAsync(request); return CreatedAtAction(nameof(GetById), new { id = r.Id }, r); }
        catch (FluentValidation.ValidationException ex) { return BadRequest(ex.Errors); }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBlogPostRequest request)
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
