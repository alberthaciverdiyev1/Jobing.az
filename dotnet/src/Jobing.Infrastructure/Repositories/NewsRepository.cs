using Microsoft.EntityFrameworkCore;
using Jobing.Domain.Repositories;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;

namespace Jobing.Infrastructure.Repositories;

public class NewsRepository : INewsRepository
{
    private readonly AppDbContext _db;

    public NewsRepository(AppDbContext db) => _db = db;

    public async Task<News?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _db.Set<News>()
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<News?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => await _db.Set<News>()
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);

    public async Task<IReadOnlyList<News>> GetAllPublishedAsync(CancellationToken cancellationToken = default)
        => await _db.Set<News>()
            .Include(x => x.Category)
            .Where(x => x.IsPublished)
            .OrderByDescending(x => x.PublishedAt)
            .ToListAsync(cancellationToken);

    public async Task<(IReadOnlyList<News> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isPublished = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        var query = _db.Set<News>().AsQueryable();

        if (!includeDeleted)
            query = query.Where(x => x.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x => EF.Functions.ILike(x.Slug, $"%{search}%"));

        if (isPublished.HasValue)
            query = query.Where(x => x.IsPublished == isPublished.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Include(x => x.Category)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<News> AddAsync(News news, CancellationToken cancellationToken = default)
    {
        _db.Set<News>().Add(news);
        await _db.SaveChangesAsync(cancellationToken);
        return news;
    }

    public async Task UpdateAsync(News news, CancellationToken cancellationToken = default)
    {
        _db.Set<News>().Update(news);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(News news, CancellationToken cancellationToken = default)
    {
        news.DeletedAt = DateTime.UtcNow;
        _db.Set<News>().Update(news);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default)
        => await _db.Set<News>().AnyAsync(x => x.Slug == slug, cancellationToken);
}
