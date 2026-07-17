using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.BlogCategories.DTOs;

namespace Jobing.Application.Features.BlogCategories;

public interface IBlogCategoryService
{
    Task<PagedResult<BlogCategoryDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default);
    Task<BlogCategoryDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BlogCategoryDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BlogCategoryDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<BlogCategoryDto> CreateAsync(CreateBlogCategoryRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateBlogCategoryRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
