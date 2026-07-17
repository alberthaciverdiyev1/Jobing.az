namespace Jobing.Application.Features.Cities.DTOs;

public class CreateCityRequest
{
    public Dictionary<string, string> Name { get; set; } = new();
    public int SortOrder { get; set; }
}
