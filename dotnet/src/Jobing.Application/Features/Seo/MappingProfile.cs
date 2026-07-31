using AutoMapper;
using Jobing.Application.Features.Seo.Commands;
using Jobing.Application.Features.Seo.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Seo;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<SeoSetting, SeoSettingDto>();
        CreateMap<CreateSeoSettingCommand, SeoSetting>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore());
        CreateMap<UpdateSeoSettingCommand, SeoSetting>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore());
    }
}
