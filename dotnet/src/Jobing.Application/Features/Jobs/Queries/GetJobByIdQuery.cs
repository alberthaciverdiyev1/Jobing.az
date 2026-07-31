using Jobing.Application.Features.Jobs.DTOs;
using MediatR;

namespace Jobing.Application.Features.Jobs.Queries;

public class GetJobByIdQuery : IRequest<JobDto?>
{
    public int Id { get; set; }
}
