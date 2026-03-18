using FingridAPI.Server.Infrastructure.Persistence;
using Polly;
using Polly.Registry;

namespace FingridAPI.Server.Infrastructure.Repositories
{
    public class FingridRepository
    {
        private readonly FingridContext _db;
        private readonly ResiliencePipeline _pipeline;

        public FingridRepository(
            FingridContext db,
            ResiliencePipelineProvider<string> pipelines)
        {
            _db = db;

            // "ef-db" is the key you registered your pipeline with
            _pipeline = pipelines.GetPipeline("ef-db");
        }


        //public async Task<List<Item>> GetItemsAsync()
        //{
        //    return await _pipeline.ExecuteAsync(async token =>
        //    {
        //        return await _db.Items.ToListAsync(token);
        //    });
        //}
    }
}
