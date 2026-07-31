using Microsoft.EntityFrameworkCore;
using Jobing.Application.Common.Interfaces;
using Jobing.Domain.Entities;
using Jobing.Infrastructure.Data;

namespace Jobing.Infrastructure.Repositories;

public class JobRepository : IJobRepository
{
    private readonly AppDbContext _db;

    public JobRepository(AppDbContext db) => _db = db;

    public async Task<Job?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _db.Set<Job>()
            .Include(x => x.Company)
            .Include(x => x.City)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<(IReadOnlyList<Job> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search = null, bool? isActive = null, Guid? cityId = null,
        bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = includeDeleted
            ? _db.Set<Job>().IgnoreQueryFilters().AsQueryable()
            : _db.Set<Job>().AsQueryable();

        query = query.Include(x => x.Company).Include(x => x.City);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(x => EF.Functions.ILike(x.Title["az"], $"%{search}%"));

        if (isActive.HasValue)
            query = query.Where(x => x.IsActive == isActive.Value);

        if (cityId.HasValue)
            query = query.Where(x => x.CityId == cityId.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Job> AddAsync(Job job, CancellationToken cancellationToken = default)
    {
        _db.Set<Job>().Add(job);
        await _db.SaveChangesAsync(cancellationToken);
        return job;
    }

    public async Task UpdateAsync(Job job, CancellationToken cancellationToken = default)
    {
        _db.Set<Job>().Update(job);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Job job, CancellationToken cancellationToken = default)
    {
        job.DeletedAt = DateTime.UtcNow;
        _db.Set<Job>().Update(job);
        await _db.SaveChangesAsync(cancellationToken);
    }
}
