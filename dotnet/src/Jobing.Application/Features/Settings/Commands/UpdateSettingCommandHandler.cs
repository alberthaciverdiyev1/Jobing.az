using AutoMapper;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Settings.Commands;

public class UpdateSettingCommandHandler : IRequestHandler<UpdateSettingCommand, Unit>
{
    private readonly ISettingRepository _repo;
    private readonly IMapper _mapper;

    public UpdateSettingCommandHandler(ISettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateSettingCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(Setting), command.Id);

        if (await _repo.KeyExistsAsync(command.Key, command.Id, cancellationToken))
            throw new ConflictException($"Setting key '{command.Key}' already exists.");

        _mapper.Map(command, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
