using Jobing.Application.Features.BlogCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetBlogCategoryBySlugQuery : IRequest<BlogCategoryDto?>
{
    public string Slug { get; set; } = string.Empty;
}
