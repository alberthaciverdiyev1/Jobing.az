using MediatR;

namespace Jobing.Application.Features.NewsCategories.Commands;

public class DeleteNewsCategoryCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
