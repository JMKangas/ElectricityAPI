using FingridAPI.Server.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FingridAPI.Server.API.Endpoints
{

    public static class SpotPriceEndpoints
    {
        public static IEndpointRouteBuilder MapSpotPriceEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/spotprice/cheap", GetCheapSpotPrices)
                .WithName("GetCheapSpotPrices");

            static async Task<IResult> GetCheapSpotPrices(
                [FromServices] SpotPriceService service,
                [FromQuery] int vartit = 96,
                [FromQuery] string aikaraja = "")
            {
                if (string.IsNullOrWhiteSpace(aikaraja))
                    aikaraja = DateTime.UtcNow.ToString("yyyy-MM-dd");

                var result = await service.GetCheapSpotPricesAsync(vartit, aikaraja);

                return Results.Ok(result);
            }

            return app;
        }
    }

}
