using MediatR;

namespace Jobing.Application.Features.BlogCategories.Commands;

public class UpdateBlogCategoryCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
