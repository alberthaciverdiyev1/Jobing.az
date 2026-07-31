using AutoMapper;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Features.Blogs.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Blogs.Commands;

public class CreateBlogPostCommandHandler : IRequestHandler<CreateBlogPostCommand, BlogPostDto>
{
    private readonly IBlogRepository _repo;
    private readonly IMapper _mapper;

    public CreateBlogPostCommandHandler(IBlogRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<BlogPostDto> Handle(CreateBlogPostCommand command, CancellationToken cancellationToken)
    {
        var post = _mapper.Map<BlogPost>(command);
        post.Slug = SlugHelper.Generate(command.Title.GetValueOrDefault("az", command.Title.Values.FirstOrDefault() ?? ""));

        var created = await _repo.AddAsync(post, cancellationToken);
        return _mapper.Map<BlogPostDto>(created);
    }
}
