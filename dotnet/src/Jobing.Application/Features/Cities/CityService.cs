using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Cities.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Cities;

public class CityService : ICityService
{
    private readonly ICityRepository _repository;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateCityRequest> _createValidator;
    private readonly IValidator<UpdateCityRequest> _updateValidator;

    public CityService(
        ICityRepository repository,
        IMapper mapper,
        IValidator<CreateCityRequest> createValidator,
        IValidator<UpdateCityRequest> updateValidator)
    {
        _repository = repository;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<CityDto>> GetPagedAsync(PaginationParams pagination, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(
            pagination.Page, pagination.PageSize,
            pagination.Search, pagination.IsActive,
            false, cancellationToken);

        return new PagedResult<CityDto>
        {
            Items = _mapper.Map<IReadOnlyList<CityDto>>(items),
            TotalCount = totalCount,
            Page = pagination.Page,
            PageSize = pagination.PageSize
        };
    }

    public async Task<CityDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var city = await _repository.GetByIdAsync(id, cancellationToken);
        return city is null ? null : _mapper.Map<CityDto>(city);
    }

    public async Task<CityDto> CreateAsync(CreateCityRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        var city = _mapper.Map<City>(request);
        city.Id = Guid.NewGuid();

        var created = await _repository.AddAsync(city, cancellationToken);
        return _mapper.Map<CityDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateCityRequest request, CancellationToken cancellationToken = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, cancellationToken);

        var city = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"City with id {id} not found");

        _mapper.Map(request, city);
        city.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(city, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var city = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"City with id {id} not found");

        await _repository.DeleteAsync(city, cancellationToken);
    }
}
