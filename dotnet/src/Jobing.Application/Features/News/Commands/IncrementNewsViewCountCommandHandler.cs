using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.News.Commands;

public class IncrementNewsViewCountCommandHandler : IRequestHandler<IncrementNewsViewCountCommand, Unit>
{
    private readonly INewsRepository _repo;

    public IncrementNewsViewCountCommandHandler(INewsRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(IncrementNewsViewCountCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(News), command.Id);

        entity.ViewCount++;
        await _repo.UpdateAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
