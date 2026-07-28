namespace Jobing.Application.Features.Blogs.DTOs;

public class UpdateBlogPostRequest
{
    public Dictionary<string, string> Title { get; set; } = new();
    public Dictionary<string, string>? Content { get; set; }
    public Dictionary<string, string>? Excerpt { get; set; }
    public string? CoverImage { get; set; }
    public Guid? CategoryId { get; set; }
    public List<Guid> RelatedPostIds { get; set; } = new();
    public bool IsPublished { get; set; }
}
