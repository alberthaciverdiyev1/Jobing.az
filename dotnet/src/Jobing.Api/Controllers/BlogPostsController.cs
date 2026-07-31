using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Blogs.Commands;
using Jobing.Application.Features.Blogs.DTOs;
using Jobing.Application.Features.Blogs.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/blog-posts")]
public class BlogPostsController : ControllerBase
{
    private readonly ISender _sender;

    public BlogPostsController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<PagedResult<BlogPostDto>>> GetAll([FromQuery] GetBlogPostsQuery query)
        => Ok(await _sender.Send(query));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPostDto>> GetById(Guid id)
    {
        var r = await _sender.Send(new GetBlogPostByIdQuery { Id = id });
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<BlogPostDto>> GetBySlug(string slug)
    {
        var r = await _sender.Send(new GetBlogPostBySlugQuery { Slug = slug });
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("{id:guid}/related")]
    public async Task<ActionResult<IReadOnlyList<BlogPostDto>>> GetRelated(Guid id)
        => Ok(await _sender.Send(new GetRelatedBlogPostsQuery { Id = id }));

    [HttpPut("{id:guid}/view")]
    public async Task<IActionResult> IncrementViewCount(Guid id)
    {
        await _sender.Send(new IncrementBlogPostViewCountCommand { Id = id });
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<BlogPostDto>> Create(CreateBlogPostCommand command)
    {
        var r = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = r.Id }, r);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBlogPostCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _sender.Send(new DeleteBlogPostCommand { Id = id });
        return NoContent();
    }
}
