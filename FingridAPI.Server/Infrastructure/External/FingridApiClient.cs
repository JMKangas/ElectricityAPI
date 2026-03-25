using FingridAPI.Server.Domain.Entities;

namespace FingridAPI.Server.Infrastructure.External
{
    public class FingridApiClient
    {
        private readonly HttpClient _http;

        public FingridApiClient(HttpClient http, IConfiguration config)
        {

            _http = http;

            var key = config["FingridApi:ApiKey"];

            if (string.IsNullOrWhiteSpace(key))
                throw new Exception("Missing Fingrid API key");

            _http.DefaultRequestHeaders.Add("x-api-key", key);

        }

        public async Task<SpotPrice> GetSpotPriceAsync()
        {
            return await _http.GetFromJsonAsync<SpotPrice>("variable/248/event/json");
        }

        public async Task<DatasetMetadata> GetDatasetMetadataAsync(int id)
        {
            var result = await _http.GetFromJsonAsync<DatasetMetadata>($"datasets/{id}");

            if (result is null)
                throw new Exception("Fingrid returned null dataset metadata.");

            return result;
        }


        //public Task<DatasetMetadata> GetDatasetMetadataAsync(int id)
        //    => _http.GetFromJsonAsync<DatasetMetadata>($"datasets/{id}");

    }
}
