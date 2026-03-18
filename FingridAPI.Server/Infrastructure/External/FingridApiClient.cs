using FingridAPI.Server.Domain.Entities;

namespace FingridAPI.Server.Infrastructure.External
{
    public class FingridApiClient
    {
        private readonly HttpClient _http;

        public FingridApiClient(HttpClient http)
        {
            _http = http;
        }

        public async Task<SpotPrice> GetSpotPriceAsync()
        {
            return await _http.GetFromJsonAsync<SpotPrice>("variable/248/event/json");
        }
    }
}
