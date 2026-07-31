using Jobing.Domain.Repositories;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Repositories;

public class BlogCategoryRepository : IBlogCategoryRepository
{
    private readonly AppDbContext _context;

    public BlogCategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BlogCategory?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.BlogCategories
            .Include(x => x.BlogPosts.Where(p => p.IsPublished))
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<BlogCategory?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.BlogCategories
            .Include(x => x.BlogPosts.Where(p => p.IsPublished))
            .FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);
    }

    public async Task<IReadOnlyList<BlogCategory>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.BlogCategories
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder).ThenBy(x => x.Slug)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<BlogCategory> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        var query = includeDeleted
            ? _context.BlogCategories.IgnoreQueryFilters().AsQueryable()
            : _context.BlogCategories.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x =>
                EF.Functions.ILike(x.Slug, $"%{search}%"));

        if (isActive.HasValue)
            query = query.Where(x => x.IsActive == isActive.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(x => x.SortOrder).ThenBy(x => x.Slug)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<BlogCategory> AddAsync(BlogCategory category, CancellationToken cancellationToken = default)
    {
        await _context.BlogCategories.AddAsync(category, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return category;
    }

    public async Task UpdateAsync(BlogCategory category, CancellationToken cancellationToken = default)
    {
        _context.BlogCategories.Update(category);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(BlogCategory category, CancellationToken cancellationToken = default)
    {
        category.DeletedAt = DateTime.UtcNow;
        _context.BlogCategories.Update(category);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.BlogCategories.AnyAsync(x => x.Slug == slug, cancellationToken);
    }
}
