using System.Text;
using System.Text.RegularExpressions;

namespace Jobing.Application.Common.Helpers;

public static partial class SlugHelper
{
    public static string Generate(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return Guid.NewGuid().ToString("N")[..8];

        var normalized = text.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();

        foreach (var c in normalized)
        {
            if (c is >= 'a' and <= 'z' or >= '0' and <= '9' or '-' or '_')
                sb.Append(c);
            else if (c == ' ')
                sb.Append('-');
        }

        var slug = slugRegex().Replace(sb.ToString(), "-").Trim('-');
        return string.IsNullOrEmpty(slug) ? Guid.NewGuid().ToString("N")[..8] : slug;
    }

    [GeneratedRegex(@"-+")]
    private static partial Regex slugRegex();
}
