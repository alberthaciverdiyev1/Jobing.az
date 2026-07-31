using AutoMapper;
using Jobing.Application.Features.Jobs.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Jobs.Queries;

public class GetJobByIdQueryHandler : IRequestHandler<GetJobByIdQuery, JobDto?>
{
    private readonly IJobRepository _repo;
    private readonly IMapper _mapper;

    public GetJobByIdQueryHandler(IJobRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<JobDto?> Handle(GetJobByIdQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return entity is null ? null : _mapper.Map<JobDto>(entity);
    }
}
