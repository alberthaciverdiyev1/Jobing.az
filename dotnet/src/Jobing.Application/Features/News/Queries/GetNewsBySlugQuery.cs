using Jobing.Application.Features.News.DTOs;
using MediatR;

namespace Jobing.Application.Features.News.Queries;

public class GetNewsBySlugQuery : IRequest<NewsDto?>
{
    public string Slug { get; set; } = string.Empty;
}
