using AutoMapper;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Blogs.Commands;

public class UpdateBlogPostCommandHandler : IRequestHandler<UpdateBlogPostCommand, Unit>
{
    private readonly IBlogRepository _repo;
    private readonly IMapper _mapper;

    public UpdateBlogPostCommandHandler(IBlogRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateBlogPostCommand command, CancellationToken cancellationToken)
    {
        var post = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (post is null) throw new NotFoundException(nameof(BlogPost), command.Id);

        _mapper.Map(command, post);
        post.UpdatedAt = DateTime.UtcNow;

        if (command.IsPublished && !post.PublishedAt.HasValue)
            post.PublishedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(post, cancellationToken);
        return Unit.Value;
    }
}
