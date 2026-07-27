using AutoMapper;
using Jobing.Application.Features.NewsCategories.DTOs;

namespace Jobing.Application.Features.NewsCategories;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<Domain.Entities.NewsCategory, NewsCategoryDto>()
            .ForMember(dest => dest.NewsCount, opt => opt.MapFrom(src => src.News.Count(n => n.DeletedAt == null)));
        CreateMap<CreateNewsCategoryRequest, Domain.Entities.NewsCategory>();
        CreateMap<UpdateNewsCategoryRequest, Domain.Entities.NewsCategory>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }
}
