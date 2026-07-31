using Microsoft.EntityFrameworkCore;
using Jobing.Application.Common.Interfaces;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;

namespace Jobing.Infrastructure.Repositories;

public class SettingRepository : ISettingRepository
{
    private readonly AppDbContext _db;

    public SettingRepository(AppDbContext db) => _db = db;

    public async Task<Setting?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _db.Set<Setting>().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<Setting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
        => await _db.Set<Setting>().FirstOrDefaultAsync(x => x.Key == key, cancellationToken);

    public async Task<IReadOnlyList<Setting>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = includeDeleted
            ? _db.Set<Setting>().IgnoreQueryFilters().AsQueryable()
            : _db.Set<Setting>().AsQueryable();

        return await query
            .Where(x => x.IsActive)
            .OrderBy(x => x.Group)
            .ThenBy(x => x.SortOrder)
            .ThenBy(x => x.Key)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Setting>> GetGroupAsync(string group, CancellationToken cancellationToken = default)
        => await _db.Set<Setting>()
            .Where(x => x.Group == group && x.IsActive)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Key)
            .ToListAsync(cancellationToken);

    public async Task<(IReadOnlyList<Setting> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, string? group = null, bool? isActive = null,
        bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = includeDeleted
            ? _db.Set<Setting>().IgnoreQueryFilters().AsQueryable()
            : _db.Set<Setting>().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x => EF.Functions.ILike(x.Key, $"%{search}%")
                || EF.Functions.ILike(x.Value ?? "", $"%{search}%"));

        if (!string.IsNullOrWhiteSpace(group))
            query = query.Where(x => x.Group == group);

        if (isActive.HasValue)
            query = query.Where(x => x.IsActive == isActive.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(x => x.Group)
            .ThenBy(x => x.SortOrder)
            .ThenBy(x => x.Key)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Setting> AddAsync(Setting setting, CancellationToken cancellationToken = default)
    {
        _db.Set<Setting>().Add(setting);
        await _db.SaveChangesAsync(cancellationToken);
        return setting;
    }

    public async Task UpdateAsync(Setting setting, CancellationToken cancellationToken = default)
    {
        _db.Set<Setting>().Update(setting);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Setting setting, CancellationToken cancellationToken = default)
    {
        setting.DeletedAt = DateTime.UtcNow;
        _db.Set<Setting>().Update(setting);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> KeyExistsAsync(string key, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var query = _db.Set<Setting>().IgnoreQueryFilters().AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(x => x.Id != excludeId.Value);

        return await query.AnyAsync(x => x.Key == key, cancellationToken);
    }
}
