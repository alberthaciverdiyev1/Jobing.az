using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Commands;

public class DeleteBlogCategoryCommandHandler : IRequestHandler<DeleteBlogCategoryCommand, Unit>
{
    private readonly IBlogCategoryRepository _repo;

    public DeleteBlogCategoryCommandHandler(IBlogCategoryRepository repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteBlogCategoryCommand command, CancellationToken cancellationToken)
    {
        var category = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (category is null) throw new NotFoundException(nameof(BlogCategory), command.Id);

        await _repo.DeleteAsync(category, cancellationToken);
        return Unit.Value;
    }
}
