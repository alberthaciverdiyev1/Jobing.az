using AutoMapper;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Blogs.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Blogs.Queries;

public class GetBlogPostsQueryHandler : IRequestHandler<GetBlogPostsQuery, PagedResult<BlogPostDto>>
{
    private readonly IBlogRepository _repo;
    private readonly IMapper _mapper;

    public GetBlogPostsQueryHandler(IBlogRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<BlogPostDto>> Handle(GetBlogPostsQuery query, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            query.Page, query.PageSize,
            query.Search, null,
            false, cancellationToken);

        return new PagedResult<BlogPostDto>
        {
            Items = _mapper.Map<IReadOnlyList<BlogPostDto>>(items),
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
