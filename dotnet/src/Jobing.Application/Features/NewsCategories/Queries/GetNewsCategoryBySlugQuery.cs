using Jobing.Application.Features.NewsCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Queries;

public class GetNewsCategoryBySlugQuery : IRequest<NewsCategoryDto?>
{
    public string Slug { get; set; } = string.Empty;
}
