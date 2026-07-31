using MediatR;

namespace Jobing.Application.Features.News.Commands;

public class UpdateNewsCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public Dictionary<string, string> Title { get; set; } = new();
    public Dictionary<string, string>? Content { get; set; }
    public Dictionary<string, string>? Excerpt { get; set; }
    public string? CoverImage { get; set; }
    public int? CategoryId { get; set; }
    public bool IsPublished { get; set; }
}
