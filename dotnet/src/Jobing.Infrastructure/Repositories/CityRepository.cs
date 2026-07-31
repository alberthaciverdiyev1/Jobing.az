using Jobing.Domain.Repositories;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Repositories;

public class CityRepository : ICityRepository
{
    private readonly AppDbContext _context;

    public CityRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<City?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Cities.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<City>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Cities
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder).ThenBy(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<City> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        var query = includeDeleted
            ? _context.Cities.IgnoreQueryFilters().AsQueryable()
            : _context.Cities.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x =>
                EF.Functions.ILike(x.Name["az"], $"%{search}%") ||
                EF.Functions.ILike(x.Name["en"], $"%{search}%") ||
                EF.Functions.ILike(x.Name["ru"], $"%{search}%"));

        if (isActive.HasValue)
            query = query.Where(x => x.IsActive == isActive.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(x => x.SortOrder).ThenBy(x => x.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<City> AddAsync(City city, CancellationToken cancellationToken = default)
    {
        await _context.Cities.AddAsync(city, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return city;
    }

    public async Task UpdateAsync(City city, CancellationToken cancellationToken = default)
    {
        _context.Cities.Update(city);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(City city, CancellationToken cancellationToken = default)
    {
        city.DeletedAt = DateTime.UtcNow;
        _context.Cities.Update(city);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Cities.AnyAsync(x =>
            EF.Functions.ILike(x.Name["az"], name) ||
            EF.Functions.ILike(x.Name["en"], name) ||
            EF.Functions.ILike(x.Name["ru"], name), cancellationToken);
    }
}
