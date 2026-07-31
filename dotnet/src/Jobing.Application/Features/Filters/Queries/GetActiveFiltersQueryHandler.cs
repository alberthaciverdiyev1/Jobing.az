using AutoMapper;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Queries;

public class GetActiveFiltersQueryHandler : IRequestHandler<GetActiveFiltersQuery, IReadOnlyList<FilterDto>>
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;

    public GetActiveFiltersQueryHandler(IFilterRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<FilterDto>> Handle(GetActiveFiltersQuery query, CancellationToken cancellationToken)
    {
        var items = await _repo.GetAllActiveAsync(cancellationToken);
        return _mapper.Map<IReadOnlyList<FilterDto>>(items);
    }
}
