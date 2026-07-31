using MediatR;

namespace Jobing.Application.Features.Blogs.Commands;

public class IncrementBlogPostViewCountCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
