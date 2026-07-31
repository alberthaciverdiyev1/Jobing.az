using AutoMapper;
using Jobing.Application.Features.Blogs.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Blogs.Queries;

public class GetBlogPostByIdQueryHandler : IRequestHandler<GetBlogPostByIdQuery, BlogPostDto?>
{
    private readonly IBlogRepository _repo;
    private readonly IMapper _mapper;

    public GetBlogPostByIdQueryHandler(IBlogRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<BlogPostDto?> Handle(GetBlogPostByIdQuery query, CancellationToken cancellationToken)
    {
        var post = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return post is null ? null : _mapper.Map<BlogPostDto>(post);
    }
}
