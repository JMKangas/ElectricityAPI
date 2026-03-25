namespace FingridAPI.Server.Domain.Entities
{
    public sealed class CheapSpotPrice
    {
        public string aikaleima_suomi { get; set; } = "";
        public string aikaleima_utc { get; set; } = "";
        public double hinta { get; set; }
    }
}
