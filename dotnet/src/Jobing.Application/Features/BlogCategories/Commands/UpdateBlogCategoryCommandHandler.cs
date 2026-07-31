using AutoMapper;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Commands;

public class UpdateBlogCategoryCommandHandler : IRequestHandler<UpdateBlogCategoryCommand, Unit>
{
    private readonly IBlogCategoryRepository _repo;
    private readonly IMapper _mapper;

    public UpdateBlogCategoryCommandHandler(IBlogCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateBlogCategoryCommand command, CancellationToken cancellationToken)
    {
        var category = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (category is null) throw new NotFoundException(nameof(BlogCategory), command.Id);

        _mapper.Map(command, category);
        category.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(category, cancellationToken);
        return Unit.Value;
    }
}
