using Jobing.Domain.Entities;

namespace Jobing.Domain.Repositories;

public interface ICityRepository
{
    Task<City?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<City>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<City> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default);
    Task<City> AddAsync(City city, CancellationToken cancellationToken = default);
    Task UpdateAsync(City city, CancellationToken cancellationToken = default);
    Task DeleteAsync(City city, CancellationToken cancellationToken = default);
    Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default);
}
