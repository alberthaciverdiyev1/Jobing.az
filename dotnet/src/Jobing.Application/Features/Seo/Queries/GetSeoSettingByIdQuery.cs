using Jobing.Application.Features.Seo.DTOs;
using MediatR;

namespace Jobing.Application.Features.Seo.Queries;

public class GetSeoSettingByIdQuery : IRequest<SeoSettingDto?>
{
    public int Id { get; set; }
}
