using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.NewsCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Queries;

public class GetNewsCategoriesQuery : PaginationParams, IRequest<PagedResult<NewsCategoryDto>>
{
}
