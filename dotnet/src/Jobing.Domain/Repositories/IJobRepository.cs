using Jobing.Domain.Entities;

namespace Jobing.Domain.Repositories;

public interface IJobRepository
{
    Task<Job?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Job> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, Guid? cityId = null,
        bool includeDeleted = false, CancellationToken cancellationToken = default);
    Task<Job> AddAsync(Job job, CancellationToken cancellationToken = default);
    Task UpdateAsync(Job job, CancellationToken cancellationToken = default);
    Task DeleteAsync(Job job, CancellationToken cancellationToken = default);
}
