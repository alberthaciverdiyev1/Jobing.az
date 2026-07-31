using Jobing.Application.Features.News.DTOs;
using MediatR;

namespace Jobing.Application.Features.News.Queries;

public class GetNewsByIdQuery : IRequest<NewsDto?>
{
    public int Id { get; set; }
}
