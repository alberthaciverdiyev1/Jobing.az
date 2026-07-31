using AutoMapper;
using Jobing.Application.Features.Cities.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Cities.Commands;

public class CreateCityCommandHandler : IRequestHandler<CreateCityCommand, CityDto>
{
    private readonly ICityRepository _repo;
    private readonly IMapper _mapper;

    public CreateCityCommandHandler(ICityRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<CityDto> Handle(CreateCityCommand command, CancellationToken cancellationToken)
    {
        var city = _mapper.Map<City>(command);

        var created = await _repo.AddAsync(city, cancellationToken);
        return _mapper.Map<CityDto>(created);
    }
}
