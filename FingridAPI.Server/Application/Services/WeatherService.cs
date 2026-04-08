using FingridAPI.Server.API.DTOs;
using System.Text.Json;

namespace FingridAPI.Server.Application.Services
{


    public sealed class WeatherService
    {
        private readonly HttpClient _http;
        private readonly Dictionary<string, (WeatherResponseDto Value, DateTime Expiry)> _cache = [];

        public WeatherService(HttpClient http)
        {
            _http = http;
        }

        public async Task<WeatherResponseDto?> GetWeatherAsync(string city)
        {
            // ✅ Cache 30 min
            if (_cache.TryGetValue(city, out var cached) && cached.Expiry > DateTime.UtcNow)
                return cached.Value;

            // ✅ 1. Geocoding (city → lat/lon)
            var geoUrl =
                $"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&format=json";

            var geoJson = await _http.GetStringAsync(geoUrl);
            using var geoDoc = JsonDocument.Parse(geoJson);

            var root = geoDoc.RootElement;
            if (!root.TryGetProperty("results", out var results) || results.GetArrayLength() == 0)
                return null;

            var loc = results[0];
            double lat = loc.GetProperty("latitude").GetDouble();
            double lon = loc.GetProperty("longitude").GetDouble();

            // ✅ 2. FMI EDR CoverageJSON
            var fmiUrl =
                "https://opendata.fmi.fi/edr/collections/harmonie_scandinavia_surface/position" +
                $"?coords=POINT({lon}%20{lat})" +
                "&parameter=Temperature,WindSpeedMS,Humidity,Pressure" +
                "&crs=OGC:CRS84&f=CoverageJSON";

            var fmiJson = await _http.GetStringAsync(fmiUrl);
            using var fmiDoc = JsonDocument.Parse(fmiJson);

            var fmi = fmiDoc.RootElement;

            var times = fmi
                .GetProperty("domain")
                .GetProperty("axes")
                .GetProperty("t")
                .GetProperty("values")
                .EnumerateArray()
                .Select(v => DateTime.Parse(v.GetString()!))
                .ToArray();

            double Val(string name) =>
                fmi.GetProperty("ranges")
                   .GetProperty(name.ToLower())
                   .GetProperty("values")[0]
                   .GetDouble();

            var response = new WeatherResponseDto
            {
                City = city,
                Latitude = lat,
                Longitude = lon,
                Forecast =
                [
                    new WeatherForecastPointDto
                {
                    Time = times[0],
                    Temperature = Val("Temperature"),
                    WindSpeed   = Val("WindSpeedMS"),
                    Humidity    = Val("Humidity"),
                    Pressure    = Val("Pressure")
                }
                ]
            };

            _cache[city] = (response, DateTime.UtcNow.AddMinutes(30));
            return response;
        }
    }
}