using AutoMapper;
using FluentValidation;
using Jobing.Application.Common.DTOs;
using Jobing.Application.Common.Helpers;
using Jobing.Application.Common.Interfaces;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Filters;

public class FilterService : IFilterService
{
    private readonly IFilterRepository _repo;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateFilterRequest> _createValidator;
    private readonly IValidator<UpdateFilterRequest> _updateValidator;
    private readonly IValidator<CreateFilterOptionRequest> _createOptionValidator;
    private readonly IValidator<UpdateFilterOptionRequest> _updateOptionValidator;

    public FilterService(IFilterRepository repo, IMapper mapper,
        IValidator<CreateFilterRequest> createValidator, IValidator<UpdateFilterRequest> updateValidator,
        IValidator<CreateFilterOptionRequest> createOptionValidator, IValidator<UpdateFilterOptionRequest> updateOptionValidator)
    {
        _repo = repo; _mapper = mapper; _createValidator = createValidator; _updateValidator = updateValidator;
        _createOptionValidator = createOptionValidator; _updateOptionValidator = updateOptionValidator;
    }

    public async Task<PagedResult<FilterDto>> GetPagedAsync(PaginationParams p, CancellationToken ct = default)
    {
        var (items, total) = await _repo.GetPagedAsync(p.Page, p.PageSize, p.Search, p.IsActive, false, ct);
        return new PagedResult<FilterDto> { Items = _mapper.Map<IReadOnlyList<FilterDto>>(items), TotalCount = total, Page = p.Page, PageSize = p.PageSize };
    }

    public async Task<FilterDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _repo.GetByIdAsync(id, ct);
        return entity is null ? null : _mapper.Map<FilterDto>(entity);
    }

    public async Task<IReadOnlyList<FilterDto>> GetAllActiveAsync(CancellationToken ct = default)
    {
        var items = await _repo.GetAllActiveAsync(ct);
        return _mapper.Map<IReadOnlyList<FilterDto>>(items);
    }

    public async Task<FilterDto> CreateAsync(CreateFilterRequest request, CancellationToken ct = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, ct);

        var filter = _mapper.Map<Filter>(request);
        filter.Id = Guid.NewGuid();
        filter.Key = SlugHelper.Generate(request.Name.Values.FirstOrDefault() ?? "filter");

        var created = await _repo.AddAsync(filter, ct);
        return _mapper.Map<FilterDto>(created);
    }

    public async Task UpdateAsync(Guid id, UpdateFilterRequest request, CancellationToken ct = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, ct);

        var entity = await _repo.GetByIdAsync(id, ct) ?? throw new KeyNotFoundException($"Filter {id} not found");
        _mapper.Map(request, entity);
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity, ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _repo.GetByIdAsync(id, ct) ?? throw new KeyNotFoundException($"Filter {id} not found");
        await _repo.DeleteAsync(entity, ct);
    }

    public async Task<FilterOptionDto?> GetOptionByIdAsync(Guid id, CancellationToken ct = default)
    {
        var option = await _repo.GetOptionByIdAsync(id, ct);
        return option is null ? null : _mapper.Map<FilterOptionDto>(option);
    }

    public async Task<FilterOptionDto> AddOptionAsync(Guid filterId, CreateFilterOptionRequest request, CancellationToken ct = default)
    {
        await _createOptionValidator.ValidateAndThrowAsync(request, ct);

        var filter = await _repo.GetByIdAsync(filterId, ct) ?? throw new KeyNotFoundException($"Filter {filterId} not found");

        var option = _mapper.Map<FilterOption>(request);
        option.Id = Guid.NewGuid();
        option.FilterId = filterId;
        option.Value = SlugHelper.Generate(request.Name.Values.FirstOrDefault() ?? "option");

        await _repo.AddOptionAsync(option, ct);
        return _mapper.Map<FilterOptionDto>(option);
    }

    public async Task UpdateOptionAsync(Guid id, UpdateFilterOptionRequest request, CancellationToken ct = default)
    {
        await _updateOptionValidator.ValidateAndThrowAsync(request, ct);

        var option = await _repo.GetOptionByIdAsync(id, ct) ?? throw new KeyNotFoundException($"FilterOption {id} not found");
        _mapper.Map(request, option);
        option.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateOptionAsync(option, ct);
    }

    public async Task DeleteOptionAsync(Guid id, CancellationToken ct = default)
    {
        var option = await _repo.GetOptionByIdAsync(id, ct) ?? throw new KeyNotFoundException($"FilterOption {id} not found");
        await _repo.DeleteOptionAsync(option, ct);
    }
}
