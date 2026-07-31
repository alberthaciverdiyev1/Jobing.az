using MediatR;

namespace Jobing.Application.Features.Settings.Commands;

public class DeleteSettingCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
