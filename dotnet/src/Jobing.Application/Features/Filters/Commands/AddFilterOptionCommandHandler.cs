using AutoMapper;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Exceptions;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class AddFilterOptionCommandHandler : IRequestHandler<AddFilterOptionCommand, FilterOptionDto>
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;

    public AddFilterOptionCommandHandler(IFilterRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<FilterOptionDto> Handle(AddFilterOptionCommand command, CancellationToken cancellationToken)
    {
        var filter = await _repo.GetByIdAsync(command.FilterId, cancellationToken);
        if (filter is null) throw new NotFoundException(nameof(Filter), command.FilterId);

        var option = _mapper.Map<FilterOption>(command);
        option.Id = Guid.NewGuid();
        option.FilterId = command.FilterId;
        option.Value = SlugHelper.Generate(command.Name.Values.FirstOrDefault() ?? "option");

        await _repo.AddOptionAsync(option, cancellationToken);
        return _mapper.Map<FilterOptionDto>(option);
    }
}
