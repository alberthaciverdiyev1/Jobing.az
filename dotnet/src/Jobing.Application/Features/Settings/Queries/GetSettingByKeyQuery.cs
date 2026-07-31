using Jobing.Application.Features.Settings.DTOs;
using MediatR;

namespace Jobing.Application.Features.Settings.Queries;

public class GetSettingByKeyQuery : IRequest<SettingDto?>
{
    public string Key { get; set; } = string.Empty;
}
