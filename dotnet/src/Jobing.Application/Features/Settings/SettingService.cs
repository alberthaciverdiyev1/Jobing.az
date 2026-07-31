using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Settings.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Settings;

public class SettingService : ISettingService
{
    private readonly ISettingRepository _repo;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateSettingRequest> _createValidator;
    private readonly IValidator<UpdateSettingRequest> _updateValidator;

    public SettingService(ISettingRepository repo, IMapper mapper,
        IValidator<CreateSettingRequest> createValidator,
        IValidator<UpdateSettingRequest> updateValidator)
    {
        _repo = repo;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<SettingDto>> GetPagedAsync(PaginationParams pagination, string? group = null, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            pagination.Page, pagination.PageSize, pagination.Search, group, pagination.IsActive,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<SettingDto>>(items);
        return new PagedResult<SettingDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<IReadOnlyList<SettingDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repo.GetAllAsync(cancellationToken: cancellationToken);
        return _mapper.Map<IReadOnlyList<SettingDto>>(items);
    }

    public async Task<IReadOnlyDictionary<string, string>> GetDictionaryAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repo.GetAllAsync(cancellationToken: cancellationToken);
        return items.ToDictionary(x => x.Key, x => x.Value ?? string.Empty);
    }

    public async Task<IReadOnlyList<SettingDto>> GetGroupAsync(string group, CancellationToken cancellationToken = default)
    {
        var items = await _repo.GetGroupAsync(group, cancellationToken);
        return _mapper.Map<IReadOnlyList<SettingDto>>(items);
    }

    public async Task<SettingDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : _mapper.Map<SettingDto>(entity);
    }

    public async Task<SettingDto?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByKeyAsync(key, cancellationToken);
        return entity is null ? null : _mapper.Map<SettingDto>(entity);
    }

    public async Task<SettingDto> CreateAsync(CreateSettingRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        if (await _repo.KeyExistsAsync(request.Key, cancellationToken: cancellationToken))
            throw new InvalidOperationException($"Setting key '{request.Key}' already exists.");

        var entity = _mapper.Map<Setting>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<SettingDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateSettingRequest request, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"Setting with id {id} not found.");

        if (await _repo.KeyExistsAsync(request.Key, id, cancellationToken))
            throw new InvalidOperationException($"Setting key '{request.Key}' already exists.");

        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"Setting with id {id} not found.");

        await _repo.DeleteAsync(entity, cancellationToken);
    }
}
