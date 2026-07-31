using MediatR;

namespace Jobing.Application.Features.NewsCategories.Commands;

public class DeleteNewsCategoryCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
