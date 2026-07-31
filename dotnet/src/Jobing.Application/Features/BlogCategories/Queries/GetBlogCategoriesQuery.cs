using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.BlogCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetBlogCategoriesQuery : PaginationParams, IRequest<PagedResult<BlogCategoryDto>>
{
}
