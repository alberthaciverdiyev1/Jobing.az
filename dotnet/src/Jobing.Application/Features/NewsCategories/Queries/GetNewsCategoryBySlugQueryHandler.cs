using AutoMapper;
using Jobing.Application.Features.NewsCategories.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Queries;

public class GetNewsCategoryBySlugQueryHandler : IRequestHandler<GetNewsCategoryBySlugQuery, NewsCategoryDto?>
{
    private readonly INewsCategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetNewsCategoryBySlugQueryHandler(INewsCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<NewsCategoryDto?> Handle(GetNewsCategoryBySlugQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetBySlugAsync(query.Slug, cancellationToken);
        return entity is null ? null : _mapper.Map<NewsCategoryDto>(entity);
    }
}
