using AutoMapper;
using Jobing.Application.Features.Settings.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Settings.Queries;

public class GetSettingByKeyQueryHandler : IRequestHandler<GetSettingByKeyQuery, SettingDto?>
{
    private readonly ISettingRepository _repo;
    private readonly IMapper _mapper;

    public GetSettingByKeyQueryHandler(ISettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SettingDto?> Handle(GetSettingByKeyQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByKeyAsync(query.Key, cancellationToken);
        return entity is null ? null : _mapper.Map<SettingDto>(entity);
    }
}
