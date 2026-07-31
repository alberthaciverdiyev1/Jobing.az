using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class DeleteFilterCommandHandler : IRequestHandler<DeleteFilterCommand, Unit>
{
    private readonly IFilterRepository _repo;

    public DeleteFilterCommandHandler(IFilterRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteFilterCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(Filter), command.Id);

        await _repo.DeleteAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
