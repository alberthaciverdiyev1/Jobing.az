using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Blogs.Commands;

public class IncrementBlogPostViewCountCommandHandler : IRequestHandler<IncrementBlogPostViewCountCommand, Unit>
{
    private readonly IBlogRepository _repo;

    public IncrementBlogPostViewCountCommandHandler(IBlogRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(IncrementBlogPostViewCountCommand command, CancellationToken cancellationToken)
    {
        var post = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (post is null) throw new NotFoundException(nameof(BlogPost), command.Id);

        post.ViewCount++;
        await _repo.UpdateAsync(post, cancellationToken);
        return Unit.Value;
    }
}
