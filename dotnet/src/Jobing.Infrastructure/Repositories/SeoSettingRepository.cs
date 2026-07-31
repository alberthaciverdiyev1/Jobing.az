using Microsoft.EntityFrameworkCore;
using Jobing.Domain.Repositories;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;

namespace Jobing.Infrastructure.Repositories;

public class SeoSettingRepository : ISeoSettingRepository
{
    private readonly AppDbContext _db;

    public SeoSettingRepository(AppDbContext db) => _db = db;

    public async Task<SeoSetting?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _db.Set<SeoSetting>().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<SeoSetting?> GetByPageKeyAsync(string pageKey, CancellationToken cancellationToken = default)
        => await _db.Set<SeoSetting>().FirstOrDefaultAsync(x => x.PageKey == pageKey, cancellationToken);

    public async Task<IReadOnlyList<SeoSetting>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = includeDeleted
            ? _db.Set<SeoSetting>().IgnoreQueryFilters().AsQueryable()
            : _db.Set<SeoSetting>().AsQueryable();

        return await query
            .Where(x => x.IsActive)
            .OrderBy(x => x.PageKey)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<SeoSetting> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null,
        bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = includeDeleted
            ? _db.Set<SeoSetting>().IgnoreQueryFilters().AsQueryable()
            : _db.Set<SeoSetting>().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x => EF.Functions.ILike(x.PageKey, $"%{search}%"));

        if (isActive.HasValue)
            query = query.Where(x => x.IsActive == isActive.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(x => x.PageKey)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<SeoSetting> AddAsync(SeoSetting seoSetting, CancellationToken cancellationToken = default)
    {
        _db.Set<SeoSetting>().Add(seoSetting);
        await _db.SaveChangesAsync(cancellationToken);
        return seoSetting;
    }

    public async Task UpdateAsync(SeoSetting seoSetting, CancellationToken cancellationToken = default)
    {
        _db.Set<SeoSetting>().Update(seoSetting);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(SeoSetting seoSetting, CancellationToken cancellationToken = default)
    {
        seoSetting.DeletedAt = DateTime.UtcNow;
        _db.Set<SeoSetting>().Update(seoSetting);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> PageKeyExistsAsync(string pageKey, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var query = _db.Set<SeoSetting>().IgnoreQueryFilters().AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(x => x.Id != excludeId.Value);

        return await query.AnyAsync(x => x.PageKey == pageKey, cancellationToken);
    }
}
