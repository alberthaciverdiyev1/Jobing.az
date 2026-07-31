using MediatR;

namespace Jobing.Application.Features.Profile.Commands;

public class UpdateProfileCommand : IRequest<Unit>
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Surname { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public string? Title { get; set; }
    public string? Bio { get; set; }
}
