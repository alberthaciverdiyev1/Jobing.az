using AutoMapper;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Seo.Commands;

public class UpdateSeoSettingCommandHandler : IRequestHandler<UpdateSeoSettingCommand, Unit>
{
    private readonly ISeoSettingRepository _repo;
    private readonly IMapper _mapper;

    public UpdateSeoSettingCommandHandler(ISeoSettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateSeoSettingCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(SeoSetting), command.Id);

        if (await _repo.PageKeyExistsAsync(command.PageKey, command.Id, cancellationToken))
            throw new ConflictException($"SEO page key '{command.PageKey}' already exists.");

        _mapper.Map(command, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
