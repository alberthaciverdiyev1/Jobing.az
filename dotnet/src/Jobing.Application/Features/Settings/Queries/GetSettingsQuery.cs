using Jobing.Application.Common.DTOs;
using Jobing.Application.Features.Settings.DTOs;
using MediatR;

namespace Jobing.Application.Features.Settings.Queries;

public class GetSettingsQuery : PaginationParams, IRequest<PagedResult<SettingDto>>
{
}
