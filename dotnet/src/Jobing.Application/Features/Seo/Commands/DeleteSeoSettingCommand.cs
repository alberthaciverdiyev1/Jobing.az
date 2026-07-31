using MediatR;

namespace Jobing.Application.Features.Seo.Commands;

public class DeleteSeoSettingCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
