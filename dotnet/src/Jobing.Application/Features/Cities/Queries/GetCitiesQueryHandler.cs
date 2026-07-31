using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Cities.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Cities.Queries;

public class GetCitiesQueryHandler : IRequestHandler<GetCitiesQuery, PagedResult<CityDto>>
{
    private readonly ICityRepository _repo;
    private readonly IMapper _mapper;

    public GetCitiesQueryHandler(ICityRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<CityDto>> Handle(GetCitiesQuery query, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            query.Page, query.PageSize,
            query.Search, query.IsActive,
            false, cancellationToken);

        return new PagedResult<CityDto>
        {
            Items = _mapper.Map<IReadOnlyList<CityDto>>(items),
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
