using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetBlogCategoriesQueryHandler : IRequestHandler<GetBlogCategoriesQuery, PagedResult<BlogCategoryDto>>
{
    private readonly IBlogCategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetBlogCategoriesQueryHandler(IBlogCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<BlogCategoryDto>> Handle(GetBlogCategoriesQuery query, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            query.Page, query.PageSize,
            query.Search, query.IsActive,
            false, cancellationToken);

        return new PagedResult<BlogCategoryDto>
        {
            Items = _mapper.Map<IReadOnlyList<BlogCategoryDto>>(items),
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
