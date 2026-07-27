using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.News.DTOs;

namespace Jobing.Application.Features.News;

public interface INewsService
{
    Task<PagedResult<NewsDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default);
    Task<NewsDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<NewsDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<NewsDto> CreateAsync(CreateNewsRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateNewsRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task IncrementViewCountAsync(Guid id, CancellationToken cancellationToken = default);
}
