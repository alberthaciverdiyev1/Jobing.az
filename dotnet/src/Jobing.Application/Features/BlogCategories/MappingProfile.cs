using AutoMapper;
using Jobing.Application.Features.BlogCategories.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.BlogCategories;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<BlogCategory, BlogCategoryDto>();
        CreateMap<CreateBlogCategoryRequest, BlogCategory>();
        CreateMap<UpdateBlogCategoryRequest, BlogCategory>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }
}
