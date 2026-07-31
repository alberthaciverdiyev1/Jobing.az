using AutoMapper;
using Jobing.Application.Features.News.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.News.Queries;

public class GetNewsBySlugQueryHandler : IRequestHandler<GetNewsBySlugQuery, NewsDto?>
{
    private readonly INewsRepository _repo;
    private readonly IMapper _mapper;

    public GetNewsBySlugQueryHandler(INewsRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<NewsDto?> Handle(GetNewsBySlugQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetBySlugAsync(query.Slug, cancellationToken);
        return entity is null ? null : _mapper.Map<NewsDto>(entity);
    }
}
