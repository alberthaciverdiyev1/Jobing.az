using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Jobs.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Jobs;

public class JobService : IJobService
{
    private readonly IJobRepository _repo;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateJobRequest> _createValidator;
    private readonly IValidator<UpdateJobRequest> _updateValidator;

    public JobService(IJobRepository repo, IMapper mapper,
        IValidator<CreateJobRequest> createValidator,
        IValidator<UpdateJobRequest> updateValidator)
    {
        _repo = repo;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<JobDto>> GetPagedAsync(JobPaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repo.GetPagedAsync(
            pagination.Page, pagination.PageSize, pagination.Search, pagination.IsActive, pagination.CityId,
            cancellationToken: cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<JobDto>>(items);
        return new PagedResult<JobDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<JobDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : _mapper.Map<JobDto>(entity);
    }

    public async Task<JobDto> CreateAsync(CreateJobRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = _mapper.Map<Job>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;

        var created = await _repo.AddAsync(entity, cancellationToken);
        return _mapper.Map<JobDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateJobRequest request, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"Job with id {id} not found.");

        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"Job with id {id} not found.");

        await _repo.DeleteAsync(entity, cancellationToken);
    }

    public async Task IncrementViewCountAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repo.GetByIdAsync(id, cancellationToken);
        if (entity is null) throw new KeyNotFoundException($"Job with id {id} not found.");

        entity.ViewCount++;
        await _repo.UpdateAsync(entity, cancellationToken);
    }
}
