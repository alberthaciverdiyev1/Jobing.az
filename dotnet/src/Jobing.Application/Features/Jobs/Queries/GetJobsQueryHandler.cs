using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Jobs.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Jobs.Queries;

public class GetJobsQueryHandler : IRequestHandler<GetJobsQuery, PagedResult<JobDto>>
{
    private readonly IJobRepository _repo;
    private readonly IMapper _mapper;

    public GetJobsQueryHandler(IJobRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<JobDto>> Handle(GetJobsQuery query, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            query.Page, query.PageSize, query.Search, query.IsActive, query.CityId,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<JobDto>>(items);
        return new PagedResult<JobDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
