using MediatR;

namespace Jobing.Application.Features.Cities.Commands;

public class DeleteCityCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
