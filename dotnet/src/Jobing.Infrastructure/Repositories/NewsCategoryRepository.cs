using Microsoft.EntityFrameworkCore;
using Jobing.Domain.Repositories;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;

namespace Jobing.Infrastructure.Repositories;

public class NewsCategoryRepository : INewsCategoryRepository
{
    private readonly AppDbContext _db;

    public NewsCategoryRepository(AppDbContext db) => _db = db;

    public async Task<NewsCategory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _db.Set<NewsCategory>()
            .Include(x => x.News.Where(n => n.DeletedAt == null))
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<NewsCategory?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => await _db.Set<NewsCategory>()
            .FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);

    public async Task<IReadOnlyList<NewsCategory>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _db.Set<NewsCategory>()
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Slug)
            .ToListAsync(cancellationToken);

    public async Task<(IReadOnlyList<NewsCategory> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        var query = _db.Set<NewsCategory>().AsQueryable();

        if (!includeDeleted)
            query = query.Where(x => x.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x => EF.Functions.ILike(x.Slug, $"%{search}%"));

        if (isActive.HasValue)
            query = query.Where(x => x.IsActive == isActive.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Slug)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(x => x.News.Where(n => n.DeletedAt == null))
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<NewsCategory> AddAsync(NewsCategory category, CancellationToken cancellationToken = default)
    {
        _db.Set<NewsCategory>().Add(category);
        await _db.SaveChangesAsync(cancellationToken);
        return category;
    }

    public async Task UpdateAsync(NewsCategory category, CancellationToken cancellationToken = default)
    {
        _db.Set<NewsCategory>().Update(category);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(NewsCategory category, CancellationToken cancellationToken = default)
    {
        category.DeletedAt = DateTime.UtcNow;
        _db.Set<NewsCategory>().Update(category);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default)
        => await _db.Set<NewsCategory>().AnyAsync(x => x.Slug == slug, cancellationToken);
}
