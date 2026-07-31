using MediatR;

namespace Jobing.Application.Features.News.Commands;

public class IncrementNewsViewCountCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
