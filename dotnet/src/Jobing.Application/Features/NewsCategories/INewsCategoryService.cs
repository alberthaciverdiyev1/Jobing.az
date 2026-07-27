using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.NewsCategories.DTOs;

namespace Jobing.Application.Features.NewsCategories;

public interface INewsCategoryService
{
    Task<PagedResult<NewsCategoryDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default);
    Task<NewsCategoryDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<NewsCategoryDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<NewsCategoryDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<NewsCategoryDto> CreateAsync(CreateNewsCategoryRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateNewsCategoryRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
