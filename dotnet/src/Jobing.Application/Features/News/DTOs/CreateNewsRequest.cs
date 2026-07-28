namespace Jobing.Application.Features.News.DTOs;

public class CreateNewsRequest
{
    public Dictionary<string, string> Title { get; set; } = new();
    public Dictionary<string, string>? Content { get; set; }
    public Dictionary<string, string>? Excerpt { get; set; }
    public string? CoverImage { get; set; }
    public Guid? CategoryId { get; set; }
    public bool IsPublished { get; set; }
}
