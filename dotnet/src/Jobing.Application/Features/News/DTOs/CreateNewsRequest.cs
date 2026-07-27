namespace Jobing.Application.Features.News.DTOs;

public class CreateNewsRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? Excerpt { get; set; }
    public string? CoverImage { get; set; }
    public Guid? CategoryId { get; set; }
    public bool IsPublished { get; set; }
}
