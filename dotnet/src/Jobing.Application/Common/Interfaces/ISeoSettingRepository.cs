using Jobing.Domain.Entities;

namespace Jobing.Application.Common.Interfaces;

public interface ISeoSettingRepository
{
    Task<SeoSetting?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SeoSetting?> GetByPageKeyAsync(string pageKey, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SeoSetting>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<SeoSetting> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null,
        bool includeDeleted = false, CancellationToken cancellationToken = default);
    Task<SeoSetting> AddAsync(SeoSetting seoSetting, CancellationToken cancellationToken = default);
    Task UpdateAsync(SeoSetting seoSetting, CancellationToken cancellationToken = default);
    Task DeleteAsync(SeoSetting seoSetting, CancellationToken cancellationToken = default);
    Task<bool> PageKeyExistsAsync(string pageKey, Guid? excludeId = null, CancellationToken cancellationToken = default);
}
