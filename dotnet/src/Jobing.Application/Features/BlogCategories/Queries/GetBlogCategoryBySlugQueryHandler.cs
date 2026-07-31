using AutoMapper;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetBlogCategoryBySlugQueryHandler : IRequestHandler<GetBlogCategoryBySlugQuery, BlogCategoryDto?>
{
    private readonly IBlogCategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetBlogCategoryBySlugQueryHandler(IBlogCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<BlogCategoryDto?> Handle(GetBlogCategoryBySlugQuery query, CancellationToken cancellationToken)
    {
        var category = await _repo.GetBySlugAsync(query.Slug, cancellationToken);
        return category is null ? null : _mapper.Map<BlogCategoryDto>(category);
    }
}
