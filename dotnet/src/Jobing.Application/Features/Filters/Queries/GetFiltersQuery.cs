using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Filters.DTOs;
using MediatR;

namespace Jobing.Application.Features.Filters.Queries;

public class GetFiltersQuery : PaginationParams, IRequest<PagedResult<FilterDto>>
{
}
