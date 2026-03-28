using FingridAPI.Server.Domain.Entities;
using System.Net.Http.Json;

namespace FingridAPI.Server.Infrastructure.External
{

    public sealed class SpotPriceApiClient
    {
        private readonly HttpClient _http;

        public SpotPriceApiClient(HttpClient http)
        {
            _http = http;
        }

        public async Task<List<CheapSpotPrice>> GetCheapSpotPricesAsync(
            int vartit,
            string aikaraja)
        {
            var url = $"halpa?vartit={vartit}&tulos=haja&aikaraja={aikaraja}";

            var response = await _http.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadFromJsonAsync<List<CheapSpotPrice>>();

            if (result is not null && result.Any())
            {
                result = result
                    .OrderBy(x => DateTime.Parse(x.aikaleima_utc))
                    .ToList();
            }

            return result ?? new List<CheapSpotPrice>();
            //var result = await response.Content.ReadFromJsonAsync<List<CheapSpotPrice>>();
            //if (result.Any())
            //    result.OrderBy(o => o.aikaleima_utc);
            //return result ?? new List<CheapSpotPrice>();
        }

    }
}