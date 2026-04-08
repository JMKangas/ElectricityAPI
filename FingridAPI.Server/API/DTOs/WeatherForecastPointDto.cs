namespace FingridAPI.Server.API.DTOs
{

    public sealed class WeatherForecastPointDto
    {
        public DateTime Time { get; set; }
        public double Temperature { get; set; }
        public double WindSpeed { get; set; }
        public double Humidity { get; set; }
        public double Pressure { get; set; }
    }

}
