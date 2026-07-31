using Jobing.Application.Features.NewsCategories.DTOs;
using MediatR;

namespace Jobing.Application.Features.NewsCategories.Queries;

public class GetNewsCategoryByIdQuery : IRequest<NewsCategoryDto?>
{
    public int Id { get; set; }
}
