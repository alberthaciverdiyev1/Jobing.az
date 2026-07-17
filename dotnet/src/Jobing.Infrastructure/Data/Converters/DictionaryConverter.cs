using System.Text.Json;

namespace Jobing.Infrastructure.Data.Converters;

public static class DictionaryConverter
{
    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static string Serialize<T>(T value) where T : class, new()
        => JsonSerializer.Serialize(value, Options);

    public static T Deserialize<T>(string value) where T : class, new()
        => JsonSerializer.Deserialize<T>(value, Options) ?? new();
}
