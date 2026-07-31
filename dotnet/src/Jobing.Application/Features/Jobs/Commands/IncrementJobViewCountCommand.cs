using MediatR;

namespace Jobing.Application.Features.Jobs.Commands;

public class IncrementJobViewCountCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
