using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Cities.DTOs;
using MediatR;

namespace Jobing.Application.Features.Cities.Queries;

public class GetCitiesQuery : PaginationParams, IRequest<PagedResult<CityDto>>
{
}
