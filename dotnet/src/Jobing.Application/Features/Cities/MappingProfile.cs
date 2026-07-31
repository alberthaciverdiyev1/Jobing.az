using AutoMapper;
using Jobing.Application.Features.Cities.Commands;
using Jobing.Application.Features.Cities.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Cities;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<City, CityDto>();
        CreateMap<CreateCityCommand, City>();
        CreateMap<UpdateCityCommand, City>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }
}
