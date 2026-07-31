using Jobing.Application.Features.BlogCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetBlogCategoryByIdQuery : IRequest<BlogCategoryDto?>
{
    public int Id { get; set; }
}
