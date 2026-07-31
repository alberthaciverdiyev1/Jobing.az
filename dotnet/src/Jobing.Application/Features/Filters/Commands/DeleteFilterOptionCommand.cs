using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class DeleteFilterOptionCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
