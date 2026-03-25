namespace FingridAPI.Server.Domain.Entities
{

    public sealed class SpotPriceQuarter
    {
        public double? Hinta { get; set; }
        public DateTime Alku { get; set; }
        public DateTime Loppu { get; set; }
    }

}
