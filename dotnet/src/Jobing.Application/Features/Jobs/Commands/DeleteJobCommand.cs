using MediatR;

namespace Jobing.Application.Features.Jobs.Commands;

public class DeleteJobCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
