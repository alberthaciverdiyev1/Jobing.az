using AutoMapper;
using Jobing.Application.Features.Settings.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Settings.Queries;

public class GetSettingByIdQueryHandler : IRequestHandler<GetSettingByIdQuery, SettingDto?>
{
    private readonly ISettingRepository _repo;
    private readonly IMapper _mapper;

    public GetSettingByIdQueryHandler(ISettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SettingDto?> Handle(GetSettingByIdQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return entity is null ? null : _mapper.Map<SettingDto>(entity);
    }
}
