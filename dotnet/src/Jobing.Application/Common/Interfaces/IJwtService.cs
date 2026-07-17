using Jobing.Domain.Entities;

namespace Jobing.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user, IList<string> roles);
}
