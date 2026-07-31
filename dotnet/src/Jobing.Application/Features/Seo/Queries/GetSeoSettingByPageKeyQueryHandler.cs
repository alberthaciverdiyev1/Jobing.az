using AutoMapper;
using Jobing.Application.Features.Seo.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Seo.Queries;

public class GetSeoSettingByPageKeyQueryHandler : IRequestHandler<GetSeoSettingByPageKeyQuery, SeoSettingDto?>
{
    private readonly ISeoSettingRepository _repo;
    private readonly IMapper _mapper;

    public GetSeoSettingByPageKeyQueryHandler(ISeoSettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SeoSettingDto?> Handle(GetSeoSettingByPageKeyQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByPageKeyAsync(query.PageKey, cancellationToken);
        return entity is null ? null : _mapper.Map<SeoSettingDto>(entity);
    }
}
