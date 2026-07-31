using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Blogs.DTOs;
using MediatR;

namespace Jobing.Application.Features.Blogs.Queries;

public class GetBlogPostsQuery : PaginationParams, IRequest<PagedResult<BlogPostDto>>
{
}
