using FingridAPI.Server.Domain.Entities;
using FingridAPI.Server.Infrastructure.External;

namespace FingridAPI.Server.Application.Services
{

    public sealed class SpotPriceService
    {
        private readonly SpotPriceApiClient _client;

        public SpotPriceService(SpotPriceApiClient client)
        {
            _client = client;
        }

        public Task<List<CheapSpotPrice>> GetCheapSpotPricesAsync(
            int vartit,
            string aikaraja)
            => _client.GetCheapSpotPricesAsync(vartit, aikaraja);

    }

}
