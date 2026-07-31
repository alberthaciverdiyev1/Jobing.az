using Jobing.Application.Features.BlogCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetBlogCategoryByIdQuery : IRequest<BlogCategoryDto?>
{
    public Guid Id { get; set; }
}
