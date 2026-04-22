using FingridAPI.Server.Application.Services;
using FingridAPI.Server.Domain.Entities;
using FingridAPI.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FingridAPI.Server.API.Endpoints
{
    public static class WeatherEndpoints
    {
        public static IEndpointRouteBuilder MapWeatherEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/weather", GetWeather)
               .WithName("GetWeather");

            app.MapGet("/weather_locations", GetAllLocations)
               .WithName("GetWeatherLocations");

            return app;
        }

        private static async Task<IResult> InitDataToDb(
            [FromServices] FingridContext db,
            [FromServices] WeatherService service,
            [FromServices] IHostEnvironment env)
        {
            if (!await db.WeatherLocations.AnyAsync())
            {
                var path = Path.Combine(env.ContentRootPath, "Data", "FI.txt");
                var lines = await File.ReadAllLinesAsync(path);

                var cities = lines
                    .Select(line =>
                    {
                        var p = line.Split('\t');

                        // basic safety check (avoid malformed rows)
                        if (p.Length < 6)
                            return null;

                        var featureClass = p[6];   // P / H / etc
                        var featureCode = p[7];    // PPL / PPLA / LK / etc
                        var population = 0;

                        if (p.Length > 14 && int.TryParse(p[14], out var pop))
                        {
                            population = pop;
                        }

                        if (featureClass != "P") return null;

                        if (!featureCode.StartsWith("PPL")) return null;

                        if (population < 600) return null;

                        return new WeatherLocation
                        {
                            Id = Guid.NewGuid(),
                            Name = p[1].Trim(),
                            Latitude = double.Parse(p[4].Trim(), System.Globalization.CultureInfo.InvariantCulture),
                            Longitude = double.Parse(p[5].Trim(), System.Globalization.CultureInfo.InvariantCulture),
                            CountryCode = "FI",
                            CreatedAt = DateTimeOffset.UtcNow
                        };
                    })
                    .Where(x => x != null)
                    .ToList();

                db.WeatherLocations.AddRange(cities!);
                await db.SaveChangesAsync();
            }
            return Results.Ok(new { message = "Data initialized" });
        }

        private static async Task<IResult> GetWeather(
            [FromServices] FingridContext db,
            [FromServices] WeatherService service,
            [FromServices] IHostEnvironment env,
            [FromQuery] Guid id,
            [FromQuery] string city,
            CancellationToken ct)
        {

            var result = await service.GetWeatherAsync(id, city, ct);

            if (result is null)
                return Results.NotFound(new { error = "City not found or no data" });

            return Results.Ok(result);
        }

        private static async Task<IResult> GetAllLocations(
            [FromServices] WeatherService service,
            CancellationToken ct
        )
        {
            var locations = await service.GetAllLocationsAsync(ct);

            if (locations.Count == 0)
                return Results.NoContent();

            return Results.Ok(locations);
        }

    }
}

