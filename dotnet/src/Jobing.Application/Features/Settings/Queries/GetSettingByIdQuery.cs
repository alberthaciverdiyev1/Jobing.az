using Jobing.Application.Features.Settings.DTOs;
using MediatR;

namespace Jobing.Application.Features.Settings.Queries;

public class GetSettingByIdQuery : IRequest<SettingDto?>
{
    public Guid Id { get; set; }
}
