using AutoMapper;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Queries;

public class GetFilterByIdQueryHandler : IRequestHandler<GetFilterByIdQuery, FilterDto?>
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;

    public GetFilterByIdQueryHandler(IFilterRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<FilterDto?> Handle(GetFilterByIdQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return entity is null ? null : _mapper.Map<FilterDto>(entity);
    }
}
