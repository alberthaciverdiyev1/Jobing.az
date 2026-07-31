using AutoMapper;
using Jobing.Application.Features.Seo.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Seo.Commands;

public class CreateSeoSettingCommandHandler : IRequestHandler<CreateSeoSettingCommand, SeoSettingDto>
{
    private readonly ISeoSettingRepository _repo;
    private readonly IMapper _mapper;

    public CreateSeoSettingCommandHandler(ISeoSettingRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SeoSettingDto> Handle(CreateSeoSettingCommand command, CancellationToken cancellationToken)
    {
        if (await _repo.PageKeyExistsAsync(command.PageKey, cancellationToken: cancellationToken))
            throw new ConflictException($"SEO page key '{command.PageKey}' already exists.");

        var entity = _mapper.Map<SeoSetting>(command);
        entity.CreatedAt = DateTime.UtcNow;

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<SeoSettingDto>(created);
    }
}
