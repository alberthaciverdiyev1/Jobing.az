using MediatR;

namespace Jobing.Application.Features.Jobs.Commands;

public class DeleteJobCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
