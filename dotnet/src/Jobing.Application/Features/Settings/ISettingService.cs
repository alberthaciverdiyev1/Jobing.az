using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Settings.DTOs;

namespace Jobing.Application.Features.Settings;

public interface ISettingService
{
    Task<PagedResult<SettingDto>> GetPagedAsync(PaginationParams pagination, string? group = null, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SettingDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<string, string>> GetDictionaryAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SettingDto>> GetGroupAsync(string group, CancellationToken cancellationToken = default);
    Task<SettingDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SettingDto?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<SettingDto> CreateAsync(CreateSettingRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateSettingRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
