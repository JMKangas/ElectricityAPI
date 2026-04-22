using FingridAPI.Server.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FingridAPI.Server.API.Endpoints
{

    public static class DatasetEndpoints
    {
        public static IEndpointRouteBuilder MapDatasetEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/datasets/{id:int}", GetDatasetMetadata)
               .WithName("GetDatasetMetadata");

            return app;
        }
        static async Task<IResult> GetDatasetMetadata(
            [FromServices] FingridService service,
            int id)
        {

            try
            {
                var result = await service.GetDatasetMetadataAsync(id);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }

        }

        static async Task<IResult> GetElectricityConsumption(
            [FromServices] FingridService service,
            [FromQuery] DateTime? startTime,
            [FromQuery] DateTime? endTime,
            [FromQuery] int? page,
            [FromQuery] int? pageSize)
        {
            var result = await service.GetElectricityConsumptionAsync(
                startTime,
                endTime,
                page,
                pageSize);

            return Results.Ok(result);
        }
    }
}
