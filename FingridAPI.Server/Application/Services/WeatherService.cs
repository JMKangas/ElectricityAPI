using FingridAPI.Server.API.DTOs;
using FingridAPI.Server.Domain.Entities;
using FingridAPI.Server.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text.Json;

namespace FingridAPI.Server.Application.Services
{


    public sealed class WeatherService
    {
        private readonly HttpClient _http;
        private readonly Dictionary<Guid, (WeatherResponseDto Value, DateTime Expiry)> _cache = [];
        private readonly WeatherLocationRepository _repo;

        public WeatherService(HttpClient http, WeatherLocationRepository repo)
        {
            _http = http;
            _repo = repo;
        }

        public Task<WeatherLocation?> GetLocation(Guid id, string city, CancellationToken ct)
        {
            return _repo.FetchWeatherLocationAsync(id, city, ct);
        }

        public async Task<List<WeatherCityDto>> GetAllLocationsAsync(CancellationToken ct)
        {
            var entities = await _repo.FetchAllAsync(ct);

            return entities.Select(x => new WeatherCityDto
            {
                Id = x.Id,
                Name = x.Name,
            }).ToList();
        }


        public async Task<WeatherResponseDto?> GetWeatherAsync([FromQuery] Guid id, [FromQuery] string city, CancellationToken ct)
        {
            // ✅ Cache 15 min
            if (_cache.TryGetValue(id, out var cached) && cached.Expiry > DateTime.UtcNow)
                return cached.Value;
            double lat = 0;
            double lon = 0;
            var location = await GetLocation(id, city, ct);

            if (location == null)
            {
                // ✅ 1. Geocoding (city → lat/lon)
                var geoUrl =
                    $"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&format=json";

                var geoJson = await _http.GetStringAsync(geoUrl);
                using var geoDoc = JsonDocument.Parse(geoJson);

                var root = geoDoc.RootElement;
                if (!root.TryGetProperty("results", out var results) || results.GetArrayLength() == 0)
                    return null;

                var loc = results[0];
                lat = loc.GetProperty("latitude").GetDouble();
                lon = loc.GetProperty("longitude").GetDouble();
            }
            else
            {
                lat = location.Latitude;
                lon = location.Longitude;
            }

            var fmiUrl =
                "https://opendata.fmi.fi/edr/collections/harmonie_scandinavia_surface/position" +
                $"?coords=POINT({lon.ToString(CultureInfo.InvariantCulture)} {lat.ToString(CultureInfo.InvariantCulture)})" +
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

            _cache[id] = (response, DateTime.UtcNow.AddMinutes(15));
            return response;
        }
    }
}