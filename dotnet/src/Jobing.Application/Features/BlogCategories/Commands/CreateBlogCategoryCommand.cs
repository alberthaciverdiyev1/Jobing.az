using Jobing.Application.Features.BlogCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Commands;

public class CreateBlogCategoryCommand : IRequest<BlogCategoryDto>
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
