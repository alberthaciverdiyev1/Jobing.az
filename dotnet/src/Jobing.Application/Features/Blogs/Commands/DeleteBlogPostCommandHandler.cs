using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Blogs.Commands;

public class DeleteBlogPostCommandHandler : IRequestHandler<DeleteBlogPostCommand, Unit>
{
    private readonly IBlogRepository _repo;

    public DeleteBlogPostCommandHandler(IBlogRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteBlogPostCommand command, CancellationToken cancellationToken)
    {
        var post = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (post is null) throw new NotFoundException(nameof(BlogPost), command.Id);

        await _repo.DeleteAsync(post, cancellationToken);
        return Unit.Value;
    }
}
