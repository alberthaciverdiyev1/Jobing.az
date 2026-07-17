using AutoMapper;
using Jobing.Application.Features.Cities.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Cities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<City, CityDto>();
        CreateMap<CreateCityRequest, City>();
        CreateMap<UpdateCityRequest, City>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }
}
