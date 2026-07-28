using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.NewsCategories.DTOs;

namespace Jobing.Application.Features.NewsCategories;

public class NewsCategoryService : INewsCategoryService
{
    private readonly INewsCategoryRepository _repo;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateNewsCategoryRequest> _createValidator;
    private readonly IValidator<UpdateNewsCategoryRequest> _updateValidator;

    public NewsCategoryService(INewsCategoryRepository repo, IMapper mapper,
        IValidator<CreateNewsCategoryRequest> createValidator,
        IValidator<UpdateNewsCategoryRequest> updateValidator)
    {
        _repo = repo;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<NewsCategoryDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            pagination.Page, pagination.PageSize, pagination.Search, pagination.IsActive,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<NewsCategoryDto>>(items);
        return new PagedResult<NewsCategoryDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<NewsCategoryDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : _mapper.Map<NewsCategoryDto>(entity);
    }

    public async Task<NewsCategoryDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetBySlugAsync(slug, cancellationToken);
        return entity is null ? null : _mapper.Map<NewsCategoryDto>(entity);
    }

    public async Task<IReadOnlyList<NewsCategoryDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repo.GetAllAsync(cancellationToken);
        return _mapper.Map<IReadOnlyList<NewsCategoryDto>>(items);
    }

    public async Task<NewsCategoryDto> CreateAsync(CreateNewsCategoryRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = _mapper.Map<Domain.Entities.NewsCategory>(request);
        entity.Id = Guid.NewGuid();
        entity.Slug = SlugHelper.Generate(request.Name.GetValueOrDefault("az", request.Name.Values.FirstOrDefault() ?? ""));

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<NewsCategoryDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateNewsCategoryRequest request, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"NewsCategory with id {id} not found.");

        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"NewsCategory with id {id} not found.");

        await _repo.DeleteAsync(entity, cancellationToken);
    }
}
