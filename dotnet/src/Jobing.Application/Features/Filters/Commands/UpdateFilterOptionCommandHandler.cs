using AutoMapper;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class UpdateFilterOptionCommandHandler : IRequestHandler<UpdateFilterOptionCommand, Unit>
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;

    public UpdateFilterOptionCommandHandler(IFilterRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateFilterOptionCommand command, CancellationToken cancellationToken)
    {
        var option = await _repo.GetOptionByIdAsync(command.Id, cancellationToken);
        if (option is null) throw new NotFoundException(nameof(FilterOption), command.Id);

        _mapper.Map(command, option);
        option.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateOptionAsync(option, cancellationToken);
        return Unit.Value;
    }
}
