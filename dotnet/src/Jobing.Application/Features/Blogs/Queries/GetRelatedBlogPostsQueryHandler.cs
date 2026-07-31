using AutoMapper;
using Jobing.Application.Features.Blogs.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Blogs.Queries;

public class GetRelatedBlogPostsQueryHandler : IRequestHandler<GetRelatedBlogPostsQuery, IReadOnlyList<BlogPostDto>>
{
    private readonly IBlogRepository _repo;
    private readonly IMapper _mapper;

    public GetRelatedBlogPostsQueryHandler(IBlogRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<BlogPostDto>> Handle(GetRelatedBlogPostsQuery query, CancellationToken cancellationToken)
    {
        var items = await _repo.GetRelatedPostsAsync(query.Id, cancellationToken);
        return _mapper.Map<IReadOnlyList<BlogPostDto>>(items);
    }
}
