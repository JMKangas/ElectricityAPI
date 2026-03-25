using FingridAPI.Server.Domain.Entities;

namespace FingridAPI.Server.Infrastructure.External
{
    public sealed class FingridApiClient
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

        public async Task<DatasetData> GetDatasetDataAsync(
        int datasetId,
        DateTime? start = null,
        DateTime? end = null)
        {
            // Build the base URL
            var url = $"datasets/{datasetId}/data";

            // Collect query parameters
            var query = new List<string>();

            if (start != null)
                query.Add($"startTime={start.Value:O}");

            if (end != null)
                query.Add($"endTime={end.Value:O}");

            // Attach query string if it exists
            if (query.Count > 0)
                url += "?" + string.Join("&", query);

            // Send request
            var response = await _http.GetAsync(url);
            response.EnsureSuccessStatusCode();

            // Deserialize JSON into your model
            var result = await response.Content.ReadFromJsonAsync<DatasetData>();

            return result ?? throw new Exception("Dataset data is null");
        }

        public async Task<DatasetData> GetDatasetDataAsync(
        int datasetId,
        DateTime? start = null,
        DateTime? end = null,
        int? page = null,
        int? pageSize = null)
        {
            var url = $"datasets/{datasetId}/data";

            var query = new List<string>();

            if (start != null)
                query.Add($"startTime={start.Value:O}");

            if (end != null)
                query.Add($"endTime={end.Value:O}");

            if (page != null)
                query.Add($"page={page}");

            if (pageSize != null)
                query.Add($"pageSize={pageSize}");

            if (query.Count > 0)
                url += "?" + string.Join("&", query);

            var response = await _http.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<DatasetData>();
            return result ?? throw new Exception("Dataset data is null");
        }

        //public Task<DatasetMetadata> GetDatasetMetadataAsync(int id)
        //    => _http.GetFromJsonAsync<DatasetMetadata>($"datasets/{id}");

    }
}
