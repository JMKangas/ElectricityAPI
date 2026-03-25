using FingridAPI.Server.Application.Services;

namespace FingridAPI.Server.API.Endpoints
{

    public static class SpotPriceEndpoints
    {
        public static IEndpointRouteBuilder MapSpotPriceEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/spot-price", async (FingridService service) =>
            {
                var result = await service.GetSpotPriceAsync();
                return Results.Ok(result);
            })
            .WithName("GetSpotPrice");

            return app;
        }
    }

}
