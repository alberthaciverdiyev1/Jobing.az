using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class DeleteFilterCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
