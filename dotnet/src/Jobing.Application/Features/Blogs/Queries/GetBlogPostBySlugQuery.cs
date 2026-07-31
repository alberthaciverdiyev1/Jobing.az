using Jobing.Application.Features.Blogs.DTOs;
using MediatR;

namespace Jobing.Application.Features.Blogs.Queries;

public class GetBlogPostBySlugQuery : IRequest<BlogPostDto?>
{
    public string Slug { get; set; } = string.Empty;
}
