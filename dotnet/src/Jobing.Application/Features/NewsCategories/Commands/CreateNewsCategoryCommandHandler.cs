using AutoMapper;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Features.NewsCategories.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Commands;

public class CreateNewsCategoryCommandHandler : IRequestHandler<CreateNewsCategoryCommand, NewsCategoryDto>
{
    private readonly INewsCategoryRepository _repo;
    private readonly IMapper _mapper;

    public CreateNewsCategoryCommandHandler(INewsCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<NewsCategoryDto> Handle(CreateNewsCategoryCommand command, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<NewsCategory>(command);
        entity.Slug = SlugHelper.Generate(command.Name.GetValueOrDefault("az", command.Name.Values.FirstOrDefault() ?? ""));

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<NewsCategoryDto>(created);
    }
}
