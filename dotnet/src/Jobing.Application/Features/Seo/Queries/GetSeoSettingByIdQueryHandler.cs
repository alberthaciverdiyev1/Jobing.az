using AutoMapper;
using Jobing.Application.Features.Seo.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Seo.Queries;

public class GetSeoSettingByIdQueryHandler : IRequestHandler<GetSeoSettingByIdQuery, SeoSettingDto?>
{
    private readonly ISeoSettingRepository _repo;
    private readonly IMapper _mapper;

    public GetSeoSettingByIdQueryHandler(ISeoSettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SeoSettingDto?> Handle(GetSeoSettingByIdQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return entity is null ? null : _mapper.Map<SeoSettingDto>(entity);
    }
}
