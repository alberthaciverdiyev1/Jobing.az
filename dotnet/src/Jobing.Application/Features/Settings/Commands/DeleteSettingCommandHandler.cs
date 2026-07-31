using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Settings.Commands;

public class DeleteSettingCommandHandler : IRequestHandler<DeleteSettingCommand, Unit>
{
    private readonly ISettingRepository _repo;

    public DeleteSettingCommandHandler(ISettingRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteSettingCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(Setting), command.Id);

        await _repo.DeleteAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
