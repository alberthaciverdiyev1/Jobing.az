using AutoMapper;
using Jobing.Application.Features.Filters.Commands;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Filters;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<Filter, FilterDto>();
        CreateMap<FilterOption, FilterOptionDto>();
        CreateMap<CreateFilterCommand, Filter>();
        CreateMap<UpdateFilterCommand, Filter>()
            .ForMember(d => d.Id, o => o.Ignore())
            .ForMember(d => d.Key, o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore());
        CreateMap<AddFilterOptionCommand, FilterOption>();
        CreateMap<UpdateFilterOptionCommand, FilterOption>()
            .ForMember(d => d.Id, o => o.Ignore())
            .ForMember(d => d.FilterId, o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore());
    }
}
