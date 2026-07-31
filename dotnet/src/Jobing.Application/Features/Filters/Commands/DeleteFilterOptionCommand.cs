using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class DeleteFilterOptionCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
