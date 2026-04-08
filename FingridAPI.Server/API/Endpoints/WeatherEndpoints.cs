using FingridAPI.Server.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FingridAPI.Server.Endpoints;

public static class WeatherEndpoints
{
    public static IEndpointRouteBuilder MapWeatherEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/weather", GetWeather)
           .WithName("GetWeather");

        return app;
    }

    private static async Task<IResult> GetWeather(
        [FromServices] WeatherService service,
        [FromQuery] string city = "Helsinki")
    {
        var result = await service.GetWeatherAsync(city);

        if (result is null)
            return Results.NotFound(new { error = "City not found or no data" });

        return Results.Ok(result);
    }
}