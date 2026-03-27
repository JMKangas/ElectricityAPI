namespace FingridAPI.Server.Domain.Entities
{

    public sealed class SpotPriceQuarter
    {
        public double? Price { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

}
