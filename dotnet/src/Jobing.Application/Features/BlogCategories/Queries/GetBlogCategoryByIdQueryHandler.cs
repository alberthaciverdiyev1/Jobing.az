using AutoMapper;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Queries;

public class GetBlogCategoryByIdQueryHandler : IRequestHandler<GetBlogCategoryByIdQuery, BlogCategoryDto?>
{
    private readonly IBlogCategoryRepository _repo;
    private readonly IMapper _mapper;

    public GetBlogCategoryByIdQueryHandler(IBlogCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<BlogCategoryDto?> Handle(GetBlogCategoryByIdQuery query, CancellationToken cancellationToken)
    {
        var category = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return category is null ? null : _mapper.Map<BlogCategoryDto>(category);
    }
}
