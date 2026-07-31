using AutoMapper;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Domain.Entities;
using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.BlogCategories.Commands;

public class CreateBlogCategoryCommandHandler : IRequestHandler<CreateBlogCategoryCommand, BlogCategoryDto>
{
    private readonly IBlogCategoryRepository _repo;
    private readonly IMapper _mapper;

    public CreateBlogCategoryCommandHandler(IBlogCategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<BlogCategoryDto> Handle(CreateBlogCategoryCommand command, CancellationToken cancellationToken)
    {
        var category = _mapper.Map<BlogCategory>(command);
        category.Slug = SlugHelper.Generate(command.Name.GetValueOrDefault("az", command.Name.Values.FirstOrDefault() ?? ""));

        var created = await _repo.AddAsync(category, cancellationToken);
        return _mapper.Map<BlogCategoryDto>(created);
    }
}
