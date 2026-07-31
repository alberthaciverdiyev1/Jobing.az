using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Jobs.DTOs;
using MediatR;

namespace Jobing.Application.Features.Jobs.Queries;

public class GetJobsQuery : PaginationParams, IRequest<PagedResult<JobDto>>
{
    public Guid? CityId { get; set; }
}
