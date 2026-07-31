using Jobing.Application.Features.Filters.DTOs;
using MediatR;

namespace Jobing.Application.Features.Filters.Commands;

public class CreateFilterCommand : IRequest<FilterDto>
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
