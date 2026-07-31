using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Seo.DTOs;

namespace Jobing.Application.Features.Seo;

public interface ISeoSettingService
{
    Task<PagedResult<SeoSettingDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<string, SeoSettingDto>> GetAllActiveAsync(CancellationToken cancellationToken = default);
    Task<SeoSettingDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SeoSettingDto?> GetByPageKeyAsync(string pageKey, CancellationToken cancellationToken = default);
    Task<SeoSettingDto> CreateAsync(CreateSeoSettingRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateSeoSettingRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
