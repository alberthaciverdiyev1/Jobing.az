using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Filters.DTOs;

namespace Jobing.Application.Features.Filters;

public interface IFilterService
{
    Task<PagedResult<FilterDto>> GetPagedAsync(PaginationParams pagination, CancellationToken ct = default);
    Task<FilterDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<FilterDto>> GetAllActiveAsync(CancellationToken ct = default);
    Task<FilterDto> CreateAsync(CreateFilterRequest request, CancellationToken ct = default);
    Task UpdateAsync(Guid id, UpdateFilterRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);

    // Options
    Task<FilterOptionDto?> GetOptionByIdAsync(Guid id, CancellationToken ct = default);
    Task<FilterOptionDto> AddOptionAsync(Guid filterId, CreateFilterOptionRequest request, CancellationToken ct = default);
    Task UpdateOptionAsync(Guid id, UpdateFilterOptionRequest request, CancellationToken ct = default);
    Task DeleteOptionAsync(Guid id, CancellationToken ct = default);
}
