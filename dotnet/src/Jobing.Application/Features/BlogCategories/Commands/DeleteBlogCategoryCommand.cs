using MediatR;

namespace Jobing.Application.Features.BlogCategories.Commands;

public class DeleteBlogCategoryCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
