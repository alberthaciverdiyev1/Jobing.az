using AutoMapper;
using Jobing.Application.Features.Settings.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Settings.Commands;

public class CreateSettingCommandHandler : IRequestHandler<CreateSettingCommand, SettingDto>
{
    private readonly ISettingRepository _repo;
    private readonly IMapper _mapper;

    public CreateSettingCommandHandler(ISettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SettingDto> Handle(CreateSettingCommand command, CancellationToken cancellationToken)
    {
        if (await _repo.KeyExistsAsync(command.Key, cancellationToken: cancellationToken))
            throw new ConflictException($"Setting key '{command.Key}' already exists.");

        var entity = _mapper.Map<Setting>(command);
        entity.CreatedAt = DateTime.UtcNow;

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<SettingDto>(created);
    }
}
