using FingridAPI.Server.Domain.Entities;
using FingridAPI.Server.Infrastructure.External;

namespace FingridAPI.Server.Application.Services
{
    public class FingridService
    {
        private readonly FingridApiClient _client;

        public FingridService(FingridApiClient client)
        {
            _client = client;
        }

        public Task<SpotPrice> GetSpotPriceAsync()
            => _client.GetSpotPriceAsync();

        public async Task<DatasetMetadata> GetDatasetMetadataAsync(int id)
        {
            return await _client.GetDatasetMetadataAsync(id);
        }
    }
}
