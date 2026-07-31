using Jobing.Application.Features.NewsCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Queries;

public class GetAllNewsCategoriesQuery : IRequest<IReadOnlyList<NewsCategoryDto>>
{
}
