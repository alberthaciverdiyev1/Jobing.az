using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Settings.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Settings.Queries;

public class GetSettingsQueryHandler : IRequestHandler<GetSettingsQuery, PagedResult<SettingDto>>
{
    private readonly ISettingRepository _repo;
    private readonly IMapper _mapper;

    public GetSettingsQueryHandler(ISettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<SettingDto>> Handle(GetSettingsQuery query, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            query.Page, query.PageSize, query.Search, query.IsActive,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<SettingDto>>(items);
        return new PagedResult<SettingDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
