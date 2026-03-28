namespace FingridAPI.Server.Domain.Entities
{

    public sealed class SpotPriceResponse
    {
        public string? TimeLimit { get; set; }
        public List<SpotPriceQuarter> CheapQuarters { get; set; } = new();
    }

}
