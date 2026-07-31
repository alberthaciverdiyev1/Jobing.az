using Jobing.Application.Features.Blogs.DTOs;
using MediatR;

namespace Jobing.Application.Features.Blogs.Queries;

public class GetRelatedBlogPostsQuery : IRequest<IReadOnlyList<BlogPostDto>>
{
    public int Id { get; set; }
}
