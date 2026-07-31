using MediatR;

namespace Jobing.Application.Features.Cities.Commands;

public class DeleteCityCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
