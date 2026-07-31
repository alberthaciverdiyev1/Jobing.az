using Jobing.Domain.Entities;

namespace Jobing.Domain.Repositories;

public interface IBlogRepository
{
    Task<BlogPost?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BlogPost>> GetAllPublishedAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BlogPost>> GetRelatedPostsAsync(int id, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<BlogPost> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isPublished = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default);
    Task<BlogPost> AddAsync(BlogPost post, CancellationToken cancellationToken = default);
    Task UpdateAsync(BlogPost post, CancellationToken cancellationToken = default);
    Task DeleteAsync(BlogPost post, CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default);
}
