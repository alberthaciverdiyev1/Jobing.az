using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Seo.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Seo.Queries;

public class GetSeoSettingsQueryHandler : IRequestHandler<GetSeoSettingsQuery, PagedResult<SeoSettingDto>>
{
    private readonly ISeoSettingRepository _repo;
    private readonly IMapper _mapper;

    public GetSeoSettingsQueryHandler(ISeoSettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<SeoSettingDto>> Handle(GetSeoSettingsQuery query, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            query.Page, query.PageSize, query.Search, query.IsActive,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<SeoSettingDto>>(items);
        return new PagedResult<SeoSettingDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
