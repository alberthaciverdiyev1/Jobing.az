using MediatR;

namespace Jobing.Application.Features.Jobs.Commands;

public class IncrementJobViewCountCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
