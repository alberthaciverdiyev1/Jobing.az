using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Seo.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Seo;

public class SeoSettingService : ISeoSettingService
{
    private readonly ISeoSettingRepository _repo;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateSeoSettingRequest> _createValidator;
    private readonly IValidator<UpdateSeoSettingRequest> _updateValidator;

    public SeoSettingService(ISeoSettingRepository repo, IMapper mapper,
        IValidator<CreateSeoSettingRequest> createValidator,
        IValidator<UpdateSeoSettingRequest> updateValidator)
    {
        _repo = repo;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<SeoSettingDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            pagination.Page, pagination.PageSize, pagination.Search, pagination.IsActive,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<SeoSettingDto>>(items);
        return new PagedResult<SeoSettingDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<IReadOnlyDictionary<string, SeoSettingDto>> GetAllActiveAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repo.GetAllAsync(cancellationToken: cancellationToken);
        var dtos = _mapper.Map<IReadOnlyList<SeoSettingDto>>(items);
        return dtos.ToDictionary(x => x.PageKey, x => x);
    }

    public async Task<SeoSettingDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : _mapper.Map<SeoSettingDto>(entity);
    }

    public async Task<SeoSettingDto?> GetByPageKeyAsync(string pageKey, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByPageKeyAsync(pageKey, cancellationToken);
        return entity is null ? null : _mapper.Map<SeoSettingDto>(entity);
    }

    public async Task<SeoSettingDto> CreateAsync(CreateSeoSettingRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        if (await _repo.PageKeyExistsAsync(request.PageKey, cancellationToken: cancellationToken))
            throw new InvalidOperationException($"SEO page key '{request.PageKey}' already exists.");

        var entity = _mapper.Map<SeoSetting>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<SeoSettingDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateSeoSettingRequest request, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"SEO setting with id {id} not found.");

        if (await _repo.PageKeyExistsAsync(request.PageKey, id, cancellationToken))
            throw new InvalidOperationException($"SEO page key '{request.PageKey}' already exists.");

        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"SEO setting with id {id} not found.");

        await _repo.DeleteAsync(entity, cancellationToken);
    }
}
