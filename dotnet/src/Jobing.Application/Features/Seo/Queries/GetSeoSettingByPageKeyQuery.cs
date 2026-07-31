using Jobing.Application.Features.Seo.DTOs;
using MediatR;

namespace Jobing.Application.Features.Seo.Queries;

public class GetSeoSettingByPageKeyQuery : IRequest<SeoSettingDto?>
{
    public string PageKey { get; set; } = string.Empty;
}
