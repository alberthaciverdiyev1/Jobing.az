using Jobing.Domain.Entities;

namespace Jobing.Application.Common.Interfaces;

public interface INewsCategoryRepository
{
    Task<NewsCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<NewsCategory?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<NewsCategory>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<NewsCategory> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default);
    Task<NewsCategory> AddAsync(NewsCategory category, CancellationToken cancellationToken = default);
    Task UpdateAsync(NewsCategory category, CancellationToken cancellationToken = default);
    Task DeleteAsync(NewsCategory category, CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default);
}
