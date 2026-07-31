using AutoMapper;
using Jobing.Application.Features.Blogs.Commands;
using Jobing.Application.Features.Blogs.DTOs;
using Jobing.Domain.Entities;

namespace Jobing.Application.Features.Blogs;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<BlogPost, BlogPostDto>()
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author != null ? src.Author.Profile!.Name : null))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
        CreateMap<CreateBlogPostCommand, BlogPost>();
        CreateMap<UpdateBlogPostCommand, BlogPost>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.AuthorId, opt => opt.Ignore());
    }
}
