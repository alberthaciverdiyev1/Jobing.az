using Jobing.Application.Features.Jobs.DTOs;
using MediatR;

namespace Jobing.Application.Features.Jobs.Queries;

public class GetJobByIdQuery : IRequest<JobDto?>
{
    public Guid Id { get; set; }
}
