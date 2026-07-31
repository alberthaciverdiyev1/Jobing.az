using AutoMapper;
using Jobing.Application.Features.NewsCategories.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Queries;

public class GetNewsCategoryByIdQueryHandler : IRequestHandler<GetNewsCategoryByIdQuery, NewsCategoryDto?>
{
    private readonly INewsCategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetNewsCategoryByIdQueryHandler(INewsCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<NewsCategoryDto?> Handle(GetNewsCategoryByIdQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return entity is null ? null : _mapper.Map<NewsCategoryDto>(entity);
    }
}
