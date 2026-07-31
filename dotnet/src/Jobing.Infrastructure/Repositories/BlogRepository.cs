using Jobing.Domain.Repositories;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Jobing.Infrastructure.Repositories;

public class BlogRepository : IBlogRepository
{
    private readonly AppDbContext _context;

    public BlogRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BlogPost?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.BlogPosts
            .Include(x => x.Author).ThenInclude(x => x!.Profile)
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.BlogPosts
            .Include(x => x.Author).ThenInclude(x => x!.Profile)
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);
    }

    public async Task<IReadOnlyList<BlogPost>> GetAllPublishedAsync(CancellationToken cancellationToken = default)
    {
        return await _context.BlogPosts
            .Where(x => x.IsPublished)
            .OrderByDescending(x => x.PublishedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<BlogPost>> GetRelatedPostsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var post = await _context.BlogPosts
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => x.RelatedPostIds)
            .FirstOrDefaultAsync(cancellationToken);

        if (post == null || post.Count == 0)
            return Array.Empty<BlogPost>();

        return await _context.BlogPosts
            .AsNoTracking()
            .Include(x => x.Category)
            .Where(x => post.Contains(x.Id) && x.IsPublished)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<BlogPost> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isPublished = null, bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        var query = includeDeleted
            ? _context.BlogPosts.IgnoreQueryFilters().AsQueryable()
            : _context.BlogPosts.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x =>
                EF.Functions.ILike(x.Slug, $"%{search}%"));

        if (isPublished.HasValue)
            query = query.Where(x => x.IsPublished == isPublished.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.PublishedAt ?? x.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<BlogPost> AddAsync(BlogPost post, CancellationToken cancellationToken = default)
    {
        await _context.BlogPosts.AddAsync(post, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return post;
    }

    public async Task UpdateAsync(BlogPost post, CancellationToken cancellationToken = default)
    {
        _context.BlogPosts.Update(post);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(BlogPost post, CancellationToken cancellationToken = default)
    {
        post.DeletedAt = DateTime.UtcNow;
        _context.BlogPosts.Update(post);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.BlogPosts.AnyAsync(x => x.Slug == slug, cancellationToken);
    }
}
