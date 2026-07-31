using AutoMapper;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Cities.Commands;

public class UpdateCityCommandHandler : IRequestHandler<UpdateCityCommand, Unit>
{
    private readonly ICityRepository _repo;
    private readonly IMapper _mapper;

    public UpdateCityCommandHandler(ICityRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateCityCommand command, CancellationToken cancellationToken)
    {
        var city = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (city is null) throw new NotFoundException(nameof(City), command.Id);

        _mapper.Map(command, city);
        city.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(city, cancellationToken);
        return Unit.Value;
    }
}
