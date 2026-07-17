namespace Jobing.Application.Features.Cities.DTOs;

public class UpdateCityRequest
{
    public Dictionary<string, string> Name { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}
