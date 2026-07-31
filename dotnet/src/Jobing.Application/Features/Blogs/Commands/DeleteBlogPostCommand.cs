using MediatR;

namespace Jobing.Application.Features.Blogs.Commands;

public class DeleteBlogPostCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
