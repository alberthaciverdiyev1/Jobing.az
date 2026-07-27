using AutoMapper;
using Jobing.Application.Features.News.DTOs;

namespace Jobing.Application.Features.News;

public class MappingProfile : AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<Domain.Entities.News, NewsDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
        CreateMap<CreateNewsRequest, Domain.Entities.News>();
        CreateMap<UpdateNewsRequest, Domain.Entities.News>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }
}
