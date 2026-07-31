using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Commands;

public class DeleteNewsCategoryCommandHandler : IRequestHandler<DeleteNewsCategoryCommand, Unit>
{
    private readonly INewsCategoryRepository _repo;

    public DeleteNewsCategoryCommandHandler(INewsCategoryRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteNewsCategoryCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(NewsCategory), command.Id);

        await _repo.DeleteAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
