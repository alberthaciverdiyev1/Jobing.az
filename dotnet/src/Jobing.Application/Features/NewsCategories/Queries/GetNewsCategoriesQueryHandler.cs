using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.NewsCategories.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Queries;

public class GetNewsCategoriesQueryHandler : IRequestHandler<GetNewsCategoriesQuery, PagedResult<NewsCategoryDto>>
{
    private readonly INewsCategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetNewsCategoriesQueryHandler(INewsCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<NewsCategoryDto>> Handle(GetNewsCategoriesQuery query, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            query.Page, query.PageSize, query.Search, query.IsActive,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<NewsCategoryDto>>(items);
        return new PagedResult<NewsCategoryDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
