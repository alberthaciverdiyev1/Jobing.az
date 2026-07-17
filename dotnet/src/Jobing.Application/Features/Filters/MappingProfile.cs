using AutoMapper;
using Jobing.Application.Features.Filters.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Filters;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Filter, FilterDto>();
        CreateMap<FilterOption, FilterOptionDto>();
        CreateMap<CreateFilterRequest, Filter>();
        CreateMap<UpdateFilterRequest, Filter>()
            .ForMember(d => d.Id, o => o.Ignore())
            .ForMember(d => d.Key, o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore());
        CreateMap<CreateFilterOptionRequest, FilterOption>();
        CreateMap<UpdateFilterOptionRequest, FilterOption>()
            .ForMember(d => d.Id, o => o.Ignore())
            .ForMember(d => d.FilterId, o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore());
    }
}
