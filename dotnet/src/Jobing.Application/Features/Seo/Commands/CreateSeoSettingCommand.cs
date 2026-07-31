using Jobing.Application.Features.Seo.DTOs;
using MediatR;

namespace Jobing.Application.Features.Seo.Commands;

public class CreateSeoSettingCommand : IRequest<SeoSettingDto>
{
    public string PageKey { get; set; } = string.Empty;
    public Dictionary<string, string>? Title { get; set; }
    public Dictionary<string, string>? Description { get; set; }
    public Dictionary<string, string>? Keywords { get; set; }
    public string? OgImage { get; set; }
    public bool IsActive { get; set; } = true;
}
