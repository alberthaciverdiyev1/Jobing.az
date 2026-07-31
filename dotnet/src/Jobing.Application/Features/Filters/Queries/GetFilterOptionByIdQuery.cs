using Jobing.Application.Features.Filters.DTOs;
using MediatR;

namespace Jobing.Application.Features.Filters.Queries;

public class GetFilterOptionByIdQuery : IRequest<FilterOptionDto?>
{
    public Guid Id { get; set; }
}
