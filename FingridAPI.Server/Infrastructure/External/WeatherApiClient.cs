using System.Text.Json;

namespace FingridAPI.Server.Infrastructure.External
{

    public sealed class WeatherApiClient
    {
        private readonly HttpClient _http;

        public WeatherApiClient(HttpClient http, IConfiguration config)
        {
            _http = http;
        }

        public async Task<(double Lat, double Lon)?> GetCoordinatesAsync(string city)
        {
            var url =
                $"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&format=json";

            var json = await _http.GetStringAsync(url);
            using var doc = JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("results", out var results) ||
                results.GetArrayLength() == 0)
                return null;

            var loc = results[0];
            return (
                loc.GetProperty("latitude").GetDouble(),
                loc.GetProperty("longitude").GetDouble()
            );
        }

        public async Task<JsonDocument> GetFmiCoverageAsync(double lat, double lon)
        {
            var url =
                "https://opendata.fmi.fi/edr/collections/harmonie_scandinavia_surface/position" +
                $"?coords=POINT({lon}%20{lat})" +
                "&parameter=Temperature,WindSpeedMS,Humidity,Pressure" +
                "&crs=OGC:CRS84&f=CoverageJSON";

            var json = await _http.GetStringAsync(url);
            return JsonDocument.Parse(json);
        }
    }

}
