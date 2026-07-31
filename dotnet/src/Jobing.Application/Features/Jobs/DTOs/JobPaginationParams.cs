using Jobing.Application.Common.DTOs;

namespace Jobing.Application.Features.Jobs.DTOs;

public class JobPaginationParams : PaginationParams
{
    public Guid? CityId { get; set; }
}
