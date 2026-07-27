using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.News.DTOs;

namespace Jobing.Application.Features.News;

public class NewsService : INewsService
{
    private readonly INewsRepository _repo;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateNewsRequest> _createValidator;
    private readonly IValidator<UpdateNewsRequest> _updateValidator;

    public NewsService(INewsRepository repo, IMapper mapper,
        IValidator<CreateNewsRequest> createValidator,
        IValidator<UpdateNewsRequest> updateValidator)
    {
        _repo = repo;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<NewsDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            pagination.Page, pagination.PageSize, pagination.Search, pagination.IsActive,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<NewsDto>>(items);
        return new PagedResult<NewsDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<NewsDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : _mapper.Map<NewsDto>(entity);
    }

    public async Task<NewsDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetBySlugAsync(slug, cancellationToken);
        return entity is null ? null : _mapper.Map<NewsDto>(entity);
    }

    public async Task<NewsDto> CreateAsync(CreateNewsRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = _mapper.Map<Domain.Entities.News>(request);
        entity.Id = Guid.NewGuid();
        entity.Slug = SlugHelper.Generate(request.Title);

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<NewsDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateNewsRequest request, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"News with id {id} not found.");

        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"News with id {id} not found.");

        await _repo.DeleteAsync(entity, cancellationToken);
    }

    public async Task IncrementViewCountAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"News with id {id} not found.");

        entity.ViewCount++;
        await _repo.UpdateAsync(entity, cancellationToken);
    }
}
