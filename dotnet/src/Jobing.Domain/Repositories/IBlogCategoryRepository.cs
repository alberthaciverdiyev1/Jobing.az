using Jobing.Domain.Entities;

namespace Jobing.Domain.Repositories;

public interface IBlogCategoryRepository
{
    Task<BlogCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BlogCategory?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BlogCategory>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<BlogCategory> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default);
    Task<BlogCategory> AddAsync(BlogCategory category, CancellationToken cancellationToken = default);
    Task UpdateAsync(BlogCategory category, CancellationToken cancellationToken = default);
    Task DeleteAsync(BlogCategory category, CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default);
}
