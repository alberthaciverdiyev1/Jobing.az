using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Seo.Commands;

public class DeleteSeoSettingCommandHandler : IRequestHandler<DeleteSeoSettingCommand, Unit>
{
    private readonly ISeoSettingRepository _repo;

    public DeleteSeoSettingCommandHandler(ISeoSettingRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteSeoSettingCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(SeoSetting), command.Id);

        await _repo.DeleteAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
