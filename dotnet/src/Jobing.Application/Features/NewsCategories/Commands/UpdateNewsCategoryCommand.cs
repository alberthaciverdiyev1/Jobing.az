using MediatR;

namespace Jobing.Application.Features.NewsCategories.Commands;

public class UpdateNewsCategoryCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
