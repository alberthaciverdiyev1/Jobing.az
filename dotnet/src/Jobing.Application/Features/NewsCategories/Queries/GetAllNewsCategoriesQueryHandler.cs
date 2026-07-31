using AutoMapper;
using Jobing.Application.Features.NewsCategories.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Queries;

public class GetAllNewsCategoriesQueryHandler : IRequestHandler<GetAllNewsCategoriesQuery, IReadOnlyList<NewsCategoryDto>>
{
    private readonly INewsCategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetAllNewsCategoriesQueryHandler(INewsCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<NewsCategoryDto>> Handle(GetAllNewsCategoriesQuery query, CancellationToken cancellationToken)
    {
        var items = await _repo.GetAllAsync(cancellationToken);
        return _mapper.Map<IReadOnlyList<NewsCategoryDto>>(items);
    }
}
