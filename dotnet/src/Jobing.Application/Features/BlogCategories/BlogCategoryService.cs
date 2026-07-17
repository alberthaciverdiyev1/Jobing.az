using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.BlogCategories;

public class BlogCategoryService : IBlogCategoryService
{
    private readonly IBlogCategoryRepository _repository;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateBlogCategoryRequest> _createValidator;
    private readonly IValidator<UpdateBlogCategoryRequest> _updateValidator;

    public BlogCategoryService(
        IBlogCategoryRepository repository,
        IMapper mapper,
        IValidator<CreateBlogCategoryRequest> createValidator,
        IValidator<UpdateBlogCategoryRequest> updateValidator)
    {
        _repository = repository;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<BlogCategoryDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(
            pagination.Page, pagination.PageSize,
            pagination.Search, pagination.IsActive,
            false, cancellationToken);

        return new PagedResult<BlogCategoryDto>
        {
            Items = _mapper.Map<IReadOnlyList<BlogCategoryDto>>(items),
            TotalCount = totalCount,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<BlogCategoryDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _repository.GetByIdAsync(id, cancellationToken);
        return category is null ? null : _mapper.Map<BlogCategoryDto>(category);
    }

    public async Task<BlogCategoryDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var category = await _repository.GetBySlugAsync(slug, cancellationToken);
        return category is null ? null : _mapper.Map<BlogCategoryDto>(category);
    }

    public async Task<IReadOnlyList<BlogCategoryDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return _mapper.Map<IReadOnlyList<BlogCategoryDto>>(items);
    }

    public async Task<BlogCategoryDto> CreateAsync(CreateBlogCategoryRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        var category = _mapper.Map<BlogCategory>(request);
        category.Id = Guid.NewGuid();
        category.Slug = SlugHelper.Generate(request.Name);

        var created = await _repository.AddAsync(category, cancellationToken);
        return _mapper.Map<BlogCategoryDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateBlogCategoryRequest request, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, cancellationToken);

        var category = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"BlogCategory with id {id} not found");

        _mapper.Map(request, category);
        category.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(category, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"BlogCategory with id {id} not found");

        await _repository.DeleteAsync(category, cancellationToken);
    }
}
