using AutoMapper;
using Jobing.Application.Features.Seo.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Seo.Queries;

public class GetActiveSeoSettingsQueryHandler : IRequestHandler<GetActiveSeoSettingsQuery, IReadOnlyDictionary<string, SeoSettingDto>>
{
    private readonly ISeoSettingRepository _repo;
    private readonly IMapper _mapper;

    public GetActiveSeoSettingsQueryHandler(ISeoSettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyDictionary<string, SeoSettingDto>> Handle(GetActiveSeoSettingsQuery query, CancellationToken cancellationToken)
    {
        var items = await _repo.GetAllAsync(cancellationToken: cancellationToken);
        var dtos = _mapper.Map<IReadOnlyList<SeoSettingDto>>(items);
        return dtos.ToDictionary(x => x.PageKey, x => x);
    }
}
