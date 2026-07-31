using AutoMapper;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class CreateFilterCommandHandler : IRequestHandler<CreateFilterCommand, FilterDto>
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;

    public CreateFilterCommandHandler(IFilterRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<FilterDto> Handle(CreateFilterCommand command, CancellationToken cancellationToken)
    {
        var filter = _mapper.Map<Filter>(command);
        filter.Key = SlugHelper.Generate(command.Name.Values.FirstOrDefault() ?? "filter");

        var created = await _repo.AddAsync(filter, cancellationToken);
        return _mapper.Map<FilterDto>(created);
    }
}
