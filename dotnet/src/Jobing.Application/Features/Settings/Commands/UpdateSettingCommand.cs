using MediatR;

namespace Jobing.Application.Features.Settings.Commands;

public class UpdateSettingCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public Dictionary<string, string>? Value { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
