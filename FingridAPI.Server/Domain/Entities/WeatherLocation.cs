namespace FingridAPI.Server.Domain.Entities;

public class WeatherLocation
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public string? CountryCode { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

}