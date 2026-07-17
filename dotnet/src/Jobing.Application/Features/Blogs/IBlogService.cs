using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Blogs.DTOs;

namespace Jobing.Application.Features.Blogs;

public interface IBlogService
{
    Task<PagedResult<BlogPostDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default);
    Task<BlogPostDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BlogPostDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BlogPostDto>> GetRelatedPostsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BlogPostDto> CreateAsync(CreateBlogPostRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateBlogPostRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task IncrementViewCountAsync(Guid id, CancellationToken cancellationToken = default);
}
