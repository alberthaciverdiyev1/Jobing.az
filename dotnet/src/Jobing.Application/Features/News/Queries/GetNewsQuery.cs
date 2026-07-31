using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.News.DTOs;
using MediatR;

namespace Jobing.Application.Features.News.Queries;

public class GetNewsQuery : PaginationParams, IRequest<PagedResult<NewsDto>>
{
}
