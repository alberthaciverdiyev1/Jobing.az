namespace Jobing.Application.Features.Cities.DTOs;

public class CityDto
{
    public Guid Id { get; set; }
    public Dictionary<string, string> Name { get; set; } = new();
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
