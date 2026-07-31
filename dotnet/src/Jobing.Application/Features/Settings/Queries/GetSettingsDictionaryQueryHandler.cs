using Jobing.Domain.Repositories;
using MediatR;

namespace Jobing.Application.Features.Settings.Queries;

public class GetSettingsDictionaryQueryHandler : IRequestHandler<GetSettingsDictionaryQuery, IReadOnlyDictionary<string, Dictionary<string, string>>>
{
    private readonly ISettingRepository _repo;

    public GetSettingsDictionaryQueryHandler(ISettingRepository repo)
    {
        _repo = repo;
    }

    public async Task<IReadOnlyDictionary<string, Dictionary<string, string>>> Handle(GetSettingsDictionaryQuery query, CancellationToken cancellationToken)
    {
        var items = await _repo.GetAllAsync(cancellationToken: cancellationToken);
        return items.ToDictionary(x => x.Key, x => x.Value ?? new Dictionary<string, string>());
    }
}
