using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Cities.DTOs;

namespace Jobing.Application.Features.Cities;

public interface ICityService
{
    Task<PagedResult<CityDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default);
    Task<CityDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CityDto> CreateAsync(CreateCityRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateCityRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
