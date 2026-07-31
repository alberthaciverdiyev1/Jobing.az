using AutoMapper;
using Jobing.Application.Features.Blogs.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Blogs.Queries;

public class GetBlogPostBySlugQueryHandler : IRequestHandler<GetBlogPostBySlugQuery, BlogPostDto?>
{
    private readonly IBlogRepository _repo;
    private readonly IMapper _mapper;

    public GetBlogPostBySlugQueryHandler(IBlogRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<BlogPostDto?> Handle(GetBlogPostBySlugQuery query, CancellationToken cancellationToken)
    {
        var post = await _repo.GetBySlugAsync(query.Slug, cancellationToken);
        return post is null ? null : _mapper.Map<BlogPostDto>(post);
    }
}
