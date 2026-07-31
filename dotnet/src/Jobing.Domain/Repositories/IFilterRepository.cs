using Jobing.Domain.Entities;

namespace Jobing.Domain.Repositories;

public interface IFilterRepository
{
    Task<Filter?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Filter?> GetByKeyWithOptionsAsync(string key, CancellationToken ct = default);
    Task<IReadOnlyList<Filter>> GetAllActiveAsync(CancellationToken ct = default);
    Task<(IReadOnlyList<Filter> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search = null, bool? isActive = null, bool includeDeleted = false, CancellationToken ct = default);
    Task<Filter> AddAsync(Filter filter, CancellationToken ct = default);
    Task UpdateAsync(Filter filter, CancellationToken ct = default);
    Task DeleteAsync(Filter filter, CancellationToken ct = default);
    Task<bool> KeyExistsAsync(string key, CancellationToken ct = default);

    // Options
    Task<FilterOption?> GetOptionByIdAsync(Guid id, CancellationToken ct = default);
    Task AddOptionAsync(FilterOption option, CancellationToken ct = default);
    Task UpdateOptionAsync(FilterOption option, CancellationToken ct = default);
    Task DeleteOptionAsync(FilterOption option, CancellationToken ct = default);
}
