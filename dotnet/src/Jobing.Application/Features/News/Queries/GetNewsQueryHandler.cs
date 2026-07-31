using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.News.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.News.Queries;

public class GetNewsQueryHandler : IRequestHandler<GetNewsQuery, PagedResult<NewsDto>>
{
    private readonly INewsRepository _repo;
    private readonly IMapper _mapper;

    public GetNewsQueryHandler(INewsRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<NewsDto>> Handle(GetNewsQuery query, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            query.Page, query.PageSize, query.Search, query.IsActive,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<NewsDto>>(items);
        return new PagedResult<NewsDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
