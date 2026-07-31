using Jobing.Application.Features.Filters.DTOs;
using MediatR;

namespace Jobing.Application.Features.Filters.Queries;

public class GetFilterByIdQuery : IRequest<FilterDto?>
{
    public int Id { get; set; }
}
