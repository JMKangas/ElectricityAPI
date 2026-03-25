using FingridAPI.Server.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace FingridAPI.Server.API.Endpoints
{

    public static class DatasetEndpoints
    {
        public static IEndpointRouteBuilder MapDatasetEndpoints(this IEndpointRouteBuilder app)
        {
            // GET /datasets/{id}
            //app.MapGet("/datasets/{id:int}", async (int id, FingridService service) =>
            //{
            //    var result = await service.GetDatasetMetadataAsync(id);

            //    return Results.Ok(result);
            //})
            //.WithName("GetDatasetMetadata");

            app.MapGet("/datasets/{id:int}", GetDatasetMetadata)
                .WithName("GetDatasetMetadata");

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

            return app;
        }
    }
}
