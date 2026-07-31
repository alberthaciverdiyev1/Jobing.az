using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.NewsCategories.Commands;
using Jobing.Application.Features.NewsCategories.DTOs;
using Jobing.Application.Features.NewsCategories.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/news-categories")]
public class NewsCategoriesController : ControllerBase
{
    private readonly ISender _sender;

    public NewsCategoriesController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<PagedResult<NewsCategoryDto>>> GetAll([FromQuery] GetNewsCategoriesQuery query)
        => Ok(await _sender.Send(query));

    [HttpGet("all")]
    public async Task<ActionResult<IReadOnlyList<NewsCategoryDto>>> GetAllActive()
        => Ok(await _sender.Send(new GetAllNewsCategoriesQuery()));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NewsCategoryDto>> GetById(Guid id)
    {
        var r = await _sender.Send(new GetNewsCategoryByIdQuery { Id = id });
        return r is null ? NotFound() : Ok(r);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<NewsCategoryDto>> GetBySlug(string slug)
    {
        var r = await _sender.Send(new GetNewsCategoryBySlugQuery { Slug = slug });
        return r is null ? NotFound() : Ok(r);
    }

    [HttpPost]
    public async Task<ActionResult<NewsCategoryDto>> Create(CreateNewsCategoryCommand command)
    {
        var r = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = r.Id }, r);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateNewsCategoryCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _sender.Send(new DeleteNewsCategoryCommand { Id = id });
        return NoContent();
    }
}
