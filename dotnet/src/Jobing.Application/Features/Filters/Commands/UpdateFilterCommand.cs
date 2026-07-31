using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class UpdateFilterCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
