using AutoMapper;
using Jobing.Application.Features.Cities.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Cities.Queries;

public class GetCityByIdQueryHandler : IRequestHandler<GetCityByIdQuery, CityDto?>
{
    private readonly ICityRepository _repo;
    private readonly IMapper _mapper;

    public GetCityByIdQueryHandler(ICityRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<CityDto?> Handle(GetCityByIdQuery query, CancellationToken cancellationToken)
    {
        var city = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return city is null ? null : _mapper.Map<CityDto>(city);
    }
}
