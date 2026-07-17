using Jobing.Application.Common.Interfaces;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Repositories;

public class FilterRepository : IFilterRepository
{
    private readonly AppDbContext _context;
    public FilterRepository(AppDbContext context) => _context = context;

    public async Task<Filter?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _context.Filters.Include(x => x.Options).FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<Filter?> GetByKeyWithOptionsAsync(string key, CancellationToken ct = default)
        => await _context.Filters.Include(x => x.Options).FirstOrDefaultAsync(x => x.Key == key, ct);

    public async Task<IReadOnlyList<Filter>> GetAllActiveAsync(CancellationToken ct = default)
        => await _context.Filters.Include(x => x.Options).Where(x => x.IsActive).OrderBy(x => x.SortOrder).ToListAsync(ct);

    public async Task<(IReadOnlyList<Filter> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, bool includeDeleted = false, CancellationToken ct = default)
    {
        var q = includeDeleted ? _context.Filters.IgnoreQueryFilters().Include(x => x.Options).AsQueryable() : _context.Filters.Include(x => x.Options).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(x => EF.Functions.ILike(x.Name["az"], $"%{search}%") || EF.Functions.ILike(x.Key, $"%{search}%"));
        if (isActive.HasValue) q = q.Where(x => x.IsActive == isActive.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderBy(x => x.SortOrder).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public async Task<Filter> AddAsync(Filter filter, CancellationToken ct = default)
    {
        _context.Filters.Add(filter);
        await _context.SaveChangesAsync(ct);
        return filter;
    }

    public async Task UpdateAsync(Filter filter, CancellationToken ct = default)
    {
        _context.Filters.Update(filter);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Filter filter, CancellationToken ct = default)
    {
        filter.DeletedAt = DateTime.UtcNow;
        _context.Filters.Update(filter);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> KeyExistsAsync(string key, CancellationToken ct = default)
        => await _context.Filters.AnyAsync(x => x.Key == key, ct);

    // Options
    public async Task<FilterOption?> GetOptionByIdAsync(Guid id, CancellationToken ct = default)
        => await _context.FilterOptions.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task AddOptionAsync(FilterOption option, CancellationToken ct = default)
    {
        _context.FilterOptions.Add(option);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateOptionAsync(FilterOption option, CancellationToken ct = default)
    {
        _context.FilterOptions.Update(option);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteOptionAsync(FilterOption option, CancellationToken ct = default)
    {
        option.DeletedAt = DateTime.UtcNow;
        _context.FilterOptions.Update(option);
        await _context.SaveChangesAsync(ct);
    }
}
