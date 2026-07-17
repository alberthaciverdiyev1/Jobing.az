using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Blogs.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Blogs;

public class BlogService : IBlogService
{
    private readonly IBlogRepository _repository;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateBlogPostRequest> _createValidator;
    private readonly IValidator<UpdateBlogPostRequest> _updateValidator;

    public BlogService(
        IBlogRepository repository,
        IMapper mapper,
        IValidator<CreateBlogPostRequest> createValidator,
        IValidator<UpdateBlogPostRequest> updateValidator)
    {
        _repository = repository;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<BlogPostDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(
            pagination.Page, pagination.PageSize,
            pagination.Search, null,
            false, cancellationToken);

        return new PagedResult<BlogPostDto>
        {
            Items = _mapper.Map<IReadOnlyList<BlogPostDto>>(items),
            TotalCount = totalCount,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<BlogPostDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var post = await _repository.GetByIdAsync(id, cancellationToken);
        return post is null ? null : _mapper.Map<BlogPostDto>(post);
    }

    public async Task<BlogPostDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var post = await _repository.GetBySlugAsync(slug, cancellationToken);
        return post is null ? null : _mapper.Map<BlogPostDto>(post);
    }

    public async Task<IReadOnlyList<BlogPostDto>> GetRelatedPostsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetRelatedPostsAsync(id, cancellationToken);
        return _mapper.Map<IReadOnlyList<BlogPostDto>>(items);
    }

    public async Task<BlogPostDto> CreateAsync(CreateBlogPostRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        var post = _mapper.Map<BlogPost>(request);
        post.Id = Guid.NewGuid();
        post.Slug = SlugHelper.Generate(request.Title);

        var created = await _repository.AddAsync(post, cancellationToken);
        return _mapper.Map<BlogPostDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateBlogPostRequest request, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, cancellationToken);

        var post = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"BlogPost with id {id} not found");

        _mapper.Map(request, post);
        post.UpdatedAt = DateTime.UtcNow;

        if (request.IsPublished && !post.PublishedAt.HasValue)
            post.PublishedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(post, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var post = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"BlogPost with id {id} not found");

        await _repository.DeleteAsync(post, cancellationToken);
    }

    public async Task IncrementViewCountAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var post = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"BlogPost with id {id} not found");

        post.ViewCount++;
        await _repository.UpdateAsync(post, cancellationToken);
    }
}
