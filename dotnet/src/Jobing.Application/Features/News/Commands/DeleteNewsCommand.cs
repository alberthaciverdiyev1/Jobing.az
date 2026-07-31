using MediatR;

namespace Jobing.Application.Features.News.Commands;

public class DeleteNewsCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
