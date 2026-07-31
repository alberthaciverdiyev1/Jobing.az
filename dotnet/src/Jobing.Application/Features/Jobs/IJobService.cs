using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Jobs.DTOs;

namespace Jobing.Application.Features.Jobs;

public interface IJobService
{
    Task<PagedResult<JobDto>> GetPagedAsync(JobPaginationParams pagination, CancellationToken cancellationToken = default);
    Task<JobDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<JobDto> CreateAsync(CreateJobRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateJobRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task IncrementViewCountAsync(Guid id, CancellationToken cancellationToken = default);
}
