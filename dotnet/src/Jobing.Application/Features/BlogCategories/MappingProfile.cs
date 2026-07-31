using AutoMapper;
using Jobing.Application.Features.BlogCategories.Commands;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.BlogCategories;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<BlogCategory, BlogCategoryDto>();
        CreateMap<CreateBlogCategoryCommand, BlogCategory>();
        CreateMap<UpdateBlogCategoryCommand, BlogCategory>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }
}
