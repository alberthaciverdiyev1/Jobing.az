using MediatR;

namespace Jobing.Application.Features.Blogs.Commands;

public class IncrementBlogPostViewCountCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
