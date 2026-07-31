using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.BlogCategories.Commands;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Application.Features.BlogCategories.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/blog-categories")]
public class BlogCategoriesController : ControllerBase
{
    private readonly ISender _sender;

    public BlogCategoriesController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<PagedResult<BlogCategoryDto>>> GetAll([FromQuery] GetBlogCategoriesQuery query)
        => Ok(await _sender.Send(query));

    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyList<BlogCategoryDto>>> GetAllActive()
        => Ok(await _sender.Send(new GetAllBlogCategoriesQuery()));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogCategoryDto>> GetById(Guid id)
    {
        var r = await _sender.Send(new GetBlogCategoryByIdQuery { Id = id });
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<BlogCategoryDto>> GetBySlug(string slug)
    {
        var r = await _sender.Send(new GetBlogCategoryBySlugQuery { Slug = slug });
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost]
    public async Task<ActionResult<BlogCategoryDto>> Create(CreateBlogCategoryCommand command)
    {
        var r = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = r.Id }, r);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateBlogCategoryCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _sender.Send(new DeleteBlogCategoryCommand { Id = id });
        return NoContent();
    }
}
