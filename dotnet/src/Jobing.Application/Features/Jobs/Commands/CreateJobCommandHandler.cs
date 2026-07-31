using AutoMapper;
using Jobing.Application.Features.Jobs.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Jobs.Commands;

public class CreateJobCommandHandler : IRequestHandler<CreateJobCommand, JobDto>
{
    private readonly IJobRepository _repo;
    private readonly IMapper _mapper;

    public CreateJobCommandHandler(IJobRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<JobDto> Handle(CreateJobCommand command, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<Job>(command);
        entity.CreatedAt = DateTime.UtcNow;

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<JobDto>(created);
    }
}
