using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Jobs.Commands;
using Jobing.Application.Features.Jobs.DTOs;
using Jobing.Application.Features.Jobs.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly ISender _sender;

    public JobsController(ISender sender) => _sender = sender;

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<PagedResult<JobDto>>> GetAll([FromQuery] GetJobsQuery query)
        => Ok(await _sender.Send(query));

    [AllowAnonymous]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<JobDto>> GetById(int id)
    {
        var job = await _sender.Send(new GetJobByIdQuery { Id = id });
        return job is null ? NotFound() : Ok(job);
    }

    [AllowAnonymous]
    [HttpPut("{id:int}/view")]
    public async Task<IActionResult> IncrementViewCount(int id)
    {
        await _sender.Send(new IncrementJobViewCountCommand { Id = id });
        return NoContent();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<ActionResult<JobDto>> Create(CreateJobCommand command)
    {
        var job = await _sender.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = job.Id }, job);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateJobCommand command)
    {
        command.Id = id;
        await _sender.Send(command);
        return NoContent();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _sender.Send(new DeleteJobCommand { Id = id });
        return NoContent();
    }
}
