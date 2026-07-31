using MediatR;

namespace Jobing.Application.Features.Settings.Queries;

public class GetSettingsDictionaryQuery : IRequest<IReadOnlyDictionary<string, Dictionary<string, string>>>
{
}
