namespace FingridAPI.Server.API.DTOs
{

    public sealed class WeatherResponseDto
    {
        public string City { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public List<WeatherForecastPointDto> Forecast { get; set; } = new();
    }

}
