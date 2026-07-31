using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Cities.Commands;

public class DeleteCityCommandHandler : IRequestHandler<DeleteCityCommand, Unit>
{
    private readonly ICityRepository _repo;

    public DeleteCityCommandHandler(ICityRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteCityCommand command, CancellationToken cancellationToken)
    {
        var city = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (city is null) throw new NotFoundException(nameof(City), command.Id);

        await _repo.DeleteAsync(city, cancellationToken);
        return Unit.Value;
    }
}
