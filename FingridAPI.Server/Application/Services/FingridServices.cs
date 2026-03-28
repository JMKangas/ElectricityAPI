using FingridAPI.Server.Domain.Entities;
using FingridAPI.Server.Infrastructure.External;

namespace FingridAPI.Server.Application.Services
{
    public sealed class FingridService
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

        public async Task<DatasetData> GetElectricityConsumptionAsync(
        DateTime? start = null,
        DateTime? end = null,
        int? page = null,
        int? pageSize = null)
        {
            return await _client.GetDatasetDataAsync(124, start, end, page, pageSize);
        }
    }
}
