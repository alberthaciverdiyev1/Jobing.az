using MediatR;

namespace Jobing.Application.Features.News.Commands;

public class IncrementNewsViewCountCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
