using Jobing.Application.Features.BlogCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetAllBlogCategoriesQuery : IRequest<IReadOnlyList<BlogCategoryDto>>
{
}
