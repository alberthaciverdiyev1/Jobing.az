using AutoMapper;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Features.News.DTOs;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.News.Commands;

public class CreateNewsCommandHandler : IRequestHandler<CreateNewsCommand, NewsDto>
{
    private readonly INewsRepository _repo;
    private readonly IMapper _mapper;

    public CreateNewsCommandHandler(INewsRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<NewsDto> Handle(CreateNewsCommand command, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<Jobing.Domain.Entities.News>(command);
        entity.Id = Guid.NewGuid();
        entity.Slug = SlugHelper.Generate(command.Title.GetValueOrDefault("az", command.Title.Values.FirstOrDefault() ?? ""));

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<NewsDto>(created);
    }
}
