using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Queries;

public class GetFiltersQueryHandler : IRequestHandler<GetFiltersQuery, PagedResult<FilterDto>>
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;

    public GetFiltersQueryHandler(IFilterRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<FilterDto>> Handle(GetFiltersQuery query, CancellationToken cancellationToken)
    {
        var (items, total) = await _repo.GetPagedAsync(
            query.Page, query.PageSize, query.Search, query.IsActive, false, cancellationToken);

        return new PagedResult<FilterDto>
        {
            Items = _mapper.Map<IReadOnlyList<FilterDto>>(items),
            TotalCount = total,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
