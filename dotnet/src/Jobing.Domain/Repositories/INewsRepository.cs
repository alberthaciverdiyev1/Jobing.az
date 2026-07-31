using Jobing.Domain.Entities;

namespace Jobing.Domain.Repositories;

public interface INewsRepository
{
    Task<News?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<News?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<News>> GetAllPublishedAsync(CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<News> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isPublished = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default);
    Task<News> AddAsync(News news, CancellationToken cancellationToken = default);
    Task UpdateAsync(News news, CancellationToken cancellationToken = default);
    Task DeleteAsync(News news, CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default);
}
