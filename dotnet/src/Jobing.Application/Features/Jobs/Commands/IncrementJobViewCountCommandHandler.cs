using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Jobs.Commands;

public class IncrementJobViewCountCommandHandler : IRequestHandler<IncrementJobViewCountCommand, Unit>
{
    private readonly IJobRepository _repo;

    public IncrementJobViewCountCommandHandler(IJobRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(IncrementJobViewCountCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(Job), command.Id);

        entity.ViewCount++;
        await _repo.UpdateAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
