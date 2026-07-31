using Jobing.Application.Features.Cities.DTOs;
using MediatR;

namespace Jobing.Application.Features.Cities.Queries;

public class GetCityByIdQuery : IRequest<CityDto?>
{
    public int Id { get; set; }
}
