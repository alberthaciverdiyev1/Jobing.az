using Jobing.Application.Features.NewsCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Commands;

public class CreateNewsCategoryCommand : IRequest<NewsCategoryDto>
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
