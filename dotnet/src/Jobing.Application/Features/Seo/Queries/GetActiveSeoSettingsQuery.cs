using Jobing.Application.Features.Seo.DTOs;
using MediatR;

namespace Jobing.Application.Features.Seo.Queries;

public class GetActiveSeoSettingsQuery : IRequest<IReadOnlyDictionary<string, SeoSettingDto>>
{
}
