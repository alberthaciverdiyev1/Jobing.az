using Jobing.Application.Features.Blogs.DTOs;
using MediatR;

namespace Jobing.Application.Features.Blogs.Commands;

public class CreateBlogPostCommand : IRequest<BlogPostDto>
{
    public Dictionary<string, string> Title { get; set; } = new();
    public Dictionary<string, string>? Content { get; set; }
    public Dictionary<string, string>? Excerpt { get; set; }
    public string? CoverImage { get; set; }
    public Guid? AuthorId { get; set; }
    public Guid? CategoryId { get; set; }
    public List<Guid> RelatedPostIds { get; set; } = new();
    public bool IsPublished { get; set; }
}
