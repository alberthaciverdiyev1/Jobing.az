using Jobing.Domain.Entities;

namespace Jobing.Domain.Repositories;

public interface ISettingRepository
{
    Task<Setting?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Setting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Setting>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Setting> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null,
        bool includeDeleted = false, CancellationToken cancellationToken = default);
    Task<Setting> AddAsync(Setting setting, CancellationToken cancellationToken = default);
    Task UpdateAsync(Setting setting, CancellationToken cancellationToken = default);
    Task DeleteAsync(Setting setting, CancellationToken cancellationToken = default);
    Task<bool> KeyExistsAsync(string key, Guid? excludeId = null, CancellationToken cancellationToken = default);
}
