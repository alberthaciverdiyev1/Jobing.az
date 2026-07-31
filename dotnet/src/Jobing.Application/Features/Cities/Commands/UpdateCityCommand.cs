using MediatR;

namespace Jobing.Application.Features.Cities.Commands;

public class UpdateCityCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
