namespace FingridAPI.Server.API.DTOs
{
    public sealed class WeatherCityDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
