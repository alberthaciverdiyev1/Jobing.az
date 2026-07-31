using AutoMapper;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetAllBlogCategoriesQueryHandler : IRequestHandler<GetAllBlogCategoriesQuery, IReadOnlyList<BlogCategoryDto>>
{
    private readonly IBlogCategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetAllBlogCategoriesQueryHandler(IBlogCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<BlogCategoryDto>> Handle(GetAllBlogCategoriesQuery query, CancellationToken cancellationToken)
    {
        var items = await _repo.GetAllAsync(cancellationToken);
        return _mapper.Map<IReadOnlyList<BlogCategoryDto>>(items);
    }
}
