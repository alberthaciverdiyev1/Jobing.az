using AutoMapper;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Commands;

public class UpdateNewsCategoryCommandHandler : IRequestHandler<UpdateNewsCategoryCommand, Unit>
{
    private readonly INewsCategoryRepository _repo;
    private readonly IMapper _mapper;

    public UpdateNewsCategoryCommandHandler(INewsCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateNewsCategoryCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(NewsCategory), command.Id);

        _mapper.Map(command, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
