using AutoMapper;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Filters.Queries;

public class GetFilterOptionByIdQueryHandler : IRequestHandler<GetFilterOptionByIdQuery, FilterOptionDto?>
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;

    public GetFilterOptionByIdQueryHandler(IFilterRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<FilterOptionDto?> Handle(GetFilterOptionByIdQuery query, CancellationToken cancellationToken)
    {
        var option = await _repo.GetOptionByIdAsync(query.Id, cancellationToken);
        return option is null ? null : _mapper.Map<FilterOptionDto>(option);
    }
}
