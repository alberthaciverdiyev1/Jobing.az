using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Jobs.Commands;

public class DeleteJobCommandHandler : IRequestHandler<DeleteJobCommand, Unit>
{
    private readonly IJobRepository _repo;

    public DeleteJobCommandHandler(IJobRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteJobCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(Job), command.Id);

        await _repo.DeleteAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
