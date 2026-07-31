using Jobing.Application.Features.Cities.DTOs;
using MediatR;

namespace Jobing.Application.Features.Cities.Commands;

public class CreateCityCommand : IRequest<CityDto>
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
