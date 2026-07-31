using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class DeleteFilterCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
