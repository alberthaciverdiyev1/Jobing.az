using Jobing.Application.Features.Settings.DTOs;
using MediatR;

namespace Jobing.Application.Features.Settings.Commands;

public class CreateSettingCommand : IRequest<SettingDto>
{
    public string Key { get; set; } = string.Empty;
    public Dictionary<string, string>? Value { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
