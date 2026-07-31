using AutoMapper;
using Jobing.Application.Features.News.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.News.Queries;

public class GetNewsByIdQueryHandler : IRequestHandler<GetNewsByIdQuery, NewsDto?>
{
    private readonly INewsRepository _repo;
    private readonly IMapper _mapper;

    public GetNewsByIdQueryHandler(INewsRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<NewsDto?> Handle(GetNewsByIdQuery query, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(query.Id, cancellationToken);
        return entity is null ? null : _mapper.Map<NewsDto>(entity);
    }
}
