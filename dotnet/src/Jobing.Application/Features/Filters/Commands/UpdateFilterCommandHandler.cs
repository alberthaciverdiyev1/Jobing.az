using AutoMapper;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class UpdateFilterCommandHandler : IRequestHandler<UpdateFilterCommand, Unit>
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;

    public UpdateFilterCommandHandler(IFilterRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateFilterCommand command, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(command.Id, cancellationToken);
        if (entity is null) throw new NotFoundException(nameof(Filter), command.Id);

        _mapper.Map(command, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
        return Unit.Value;
    }
}
