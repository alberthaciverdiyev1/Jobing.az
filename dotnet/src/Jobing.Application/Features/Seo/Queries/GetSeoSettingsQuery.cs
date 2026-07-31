using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Seo.DTOs;
using MediatR;

namespace Jobing.Application.Features.Seo.Queries;

public class GetSeoSettingsQuery : PaginationParams, IRequest<PagedResult<SeoSettingDto>>
{
}
