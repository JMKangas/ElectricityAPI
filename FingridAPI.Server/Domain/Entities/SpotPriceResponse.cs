namespace FingridAPI.Server.Domain.Entities
{

    public sealed class SpotPriceResponse
    {
        public string? Aikaraja { get; set; }
        public List<SpotPriceQuarter> Halvat_vartit { get; set; } = new();
    }

}
