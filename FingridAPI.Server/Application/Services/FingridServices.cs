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
    }
}
