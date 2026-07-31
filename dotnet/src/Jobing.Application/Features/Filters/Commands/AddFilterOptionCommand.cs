using Jobing.Application.Features.Filters.DTOs;
using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class AddFilterOptionCommand : IRequest<FilterOptionDto>
{
    public int FilterId { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
