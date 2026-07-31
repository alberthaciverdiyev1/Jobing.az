using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class DeleteFilterOptionCommandHandler : IRequestHandler<DeleteFilterOptionCommand, Unit>
{
    private readonly IFilterRepository _repo;

    public DeleteFilterOptionCommandHandler(IFilterRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteFilterOptionCommand command, CancellationToken cancellationToken)
    {
        var option = await _repo.GetOptionByIdAsync(command.Id, cancellationToken);
        if (option is null) throw new NotFoundException(nameof(FilterOption), command.Id);

        await _repo.DeleteOptionAsync(option, cancellationToken);
        return Unit.Value;
    }
}
