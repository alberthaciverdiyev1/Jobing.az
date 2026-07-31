using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.News.Commands;
using Jobing.Application.Features.News.DTOs;
using Jobing.Application.Features.News.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly ISender _sender;

    public NewsController(ISender sender) => _sender = sender;

    [HttpGet]
    public async Task<ActionResult<PagedResult<NewsDto>>> GetAll([FromQuery] GetNewsQuery query)
        => Ok(await _sender.Send(query));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NewsDto>> GetById(Guid id)
    {
        var news = await _sender.Send(new GetNewsByIdQuery { Id = id });
        return news is null ? NotFound() : Ok(news);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<NewsDto>> GetBySlug(string slug)
    {
        var news = await _sender.Send(new GetNewsBySlugQuery { Slug = slug });
        return news is null ? NotFound() : Ok(news);
    }

    [HttpPut("{id:guid}/view")]
    public async Task<IActionResult> IncrementViewCount(Guid id)
    {
        await _sender.Send(new IncrementNewsViewCountCommand { Id = id });
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<NewsDto>> Create(CreateNewsCommand command)
    {
        var news = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = news.Id }, news);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateNewsCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _sender.Send(new DeleteNewsCommand { Id = id });
        return NoContent();
    }
}
